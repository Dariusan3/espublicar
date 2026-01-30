"use client";
import { useCallback, useState } from "react";
import { db, DB_ID, COLLECTIONS, Query, ID } from "@/lib/appwrite";
import { HookResponse, Product } from "@/types/Types";
import { toProduct } from "@/helpers/dbHelpers";

export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  brands?: string[];
  inStock?: boolean;
  isNew?: boolean;
  isTodaysDeals?: boolean;
  hotSale?: boolean;
  sortBy?: "price_asc" | "price_desc" | "newest" | "rating";
  limit?: number;
  offset?: number;
}

/**
 * Custom hook for product search and filtering with Appwrite
 */
const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  /**
   * Search and filter products
   */
  const searchProducts = useCallback(
    async (filters: ProductFilters = {}): Promise<HookResponse> => {
      setIsLoading(true);
      try {
        const queries: any[] = [];

        // Text search on title
        if (filters.search && filters.search.trim()) {
          queries.push(Query.search("title", filters.search.trim()));
        }

        // Category filter
        if (filters.category) {
          queries.push(Query.equal("category", filters.category));
        }

        // Price range
        if (filters.minPrice !== undefined) {
          queries.push(Query.greaterThanEqual("price", filters.minPrice));
        }
        if (filters.maxPrice !== undefined) {
          queries.push(Query.lessThanEqual("price", filters.maxPrice));
        }

        // Boolean filters
        if (filters.inStock !== undefined) {
          queries.push(Query.equal("inStock", filters.inStock));
        }
        if (filters.isNew) {
          queries.push(Query.equal("isNew", true));
        }
        if (filters.isTodaysDeals) {
          queries.push(Query.equal("isTodaysDeals", true));
        }
        if (filters.hotSale) {
          queries.push(Query.equal("hotSale", true));
        }

        // Sorting
        switch (filters.sortBy) {
          case "price_asc":
            queries.push(Query.orderAsc("price"));
            break;
          case "price_desc":
            queries.push(Query.orderDesc("price"));
            break;
          case "newest":
            queries.push(Query.orderDesc("$createdAt"));
            break;
          case "rating":
            queries.push(Query.orderDesc("rating"));
            break;
          default:
            queries.push(Query.orderDesc("$createdAt"));
        }

        // Pagination
        if (filters.limit) {
          queries.push(Query.limit(filters.limit));
        } else {
          queries.push(Query.limit(24)); // Default limit
        }
        if (filters.offset) {
          queries.push(Query.offset(filters.offset));
        }

        const response = await db.listDocuments({
          databaseId: DB_ID,
          collectionId: COLLECTIONS.PRODUCTS,
          queries,
        });

        const productList = response.documents.map(toProduct);
        setProducts(productList);
        setTotalCount(response.total);

        return {
          success: true,
          message: "Products fetched successfully",
          data: { products: productList, total: response.total },
        };
      } catch (error: any) {
        console.error("Error searching products:", error);
        return {
          success: false,
          message: error.message,
          data: null,
        };
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  /**
   * Get a single product by ID
   */
  const getProductById = useCallback(
    async (productId: string): Promise<HookResponse> => {
      try {
        const result = await db.getDocument({
          databaseId: DB_ID,
          collectionId: COLLECTIONS.PRODUCTS,
          documentId: productId,
        });

        const product = toProduct(result);

        return {
          success: true,
          message: "Product fetched successfully",
          data: product,
        };
      } catch (error: any) {
        console.error("Error fetching product:", error);
        return {
          success: false,
          message: error.message,
          data: null,
        };
      }
    },
    [],
  );

  /**
   * Get all unique categories
   */
  const getCategories = useCallback(async (): Promise<string[]> => {
    try {
      // Fetch all products and extract unique categories
      const response = await db.listDocuments({
        databaseId: DB_ID,
        collectionId: COLLECTIONS.PRODUCTS,
        queries: [Query.limit(500)],
      });

      const categories = [
        ...new Set(
          response.documents
            .map((doc: any) => doc.category)
            .filter((cat: any) => cat && cat.trim()),
        ),
      ] as string[];

      return categories.sort();
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  }, []);

  /**
   * Get all unique brands
   */
  const getBrands = useCallback(async (): Promise<string[]> => {
    try {
      const response = await db.listDocuments({
        databaseId: DB_ID,
        collectionId: COLLECTIONS.PRODUCTS,
        queries: [Query.limit(500)],
      });

      const brands = [
        ...new Set(
          response.documents
            .flatMap((doc: any) => doc.filterBrands || [])
            .filter((brand: any) => brand && brand.trim()),
        ),
      ] as string[];

      return brands.sort();
    } catch (error) {
      console.error("Error fetching brands:", error);
      return [];
    }
  }, []);

  /**
   * Get products by User ID (My Listings)
   */
  const getMyProducts = useCallback(
    async (userId: string): Promise<HookResponse> => {
      setIsLoading(true);
      try {
        const response = await db.listDocuments({
          databaseId: DB_ID,
          collectionId: COLLECTIONS.PRODUCTS,
          queries: [
            Query.equal("userId", userId),
            Query.orderDesc("$createdAt"),
          ],
        });

        const productList = response.documents.map(toProduct);
        setProducts(productList);
        setTotalCount(response.total);

        return {
          success: true,
          message: "User listings fetched successfully",
          data: productList,
        };
      } catch (error: any) {
        console.error("Error fetching user products:", error);
        return {
          success: false,
          message: error.message,
          data: null,
        };
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  /**
   * Add a new product listing
   */
  const addProduct = useCallback(
    async (productData: any): Promise<HookResponse> => {
      try {
        const result = await db.createDocument(
          DB_ID,
          COLLECTIONS.PRODUCTS,
          ID.unique(),
          productData,
        );
        const newProduct = toProduct(result);
        setProducts((prev) => [newProduct, ...prev]);
        return {
          success: true,
          message: "Product listed successfully",
          data: newProduct,
        };
      } catch (error: any) {
        console.error("Error creating product:", error);
        return {
          success: false,
          message: error.message,
          data: null,
        };
      }
    },
    [],
  );

  /**
   * Delete a product listing
   */
  const deleteProduct = useCallback(
    async (productId: string): Promise<HookResponse> => {
      try {
        await db.deleteDocument(DB_ID, COLLECTIONS.PRODUCTS, productId);
        setProducts((prev) => prev.filter((p) => p.id !== productId));
        return {
          success: true,
          message: "Product deleted successfully",
          data: null,
        };
      } catch (error: any) {
        console.error("Error deleting product:", error);
        return {
          success: false,
          message: error.message,
          data: null,
        };
      }
    },
    [],
  );

  return {
    // State
    products,
    isLoading,
    totalCount,

    // Actions
    searchProducts,
    getProductById,
    getCategories,
    getBrands,
    getMyProducts,
    addProduct,
    deleteProduct,
  };
};

export default useProducts;
