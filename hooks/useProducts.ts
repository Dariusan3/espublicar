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
  location?: string;
  condition?: string;
  userId?: string;
  sortBy?: "price_asc" | "price_desc" | "newest" | "rating";
  limit?: number;
  offset?: number;
}

const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const searchProducts = useCallback(
    async (filters: ProductFilters = {}): Promise<HookResponse> => {
      setIsLoading(true);
      try {
        // Build Appwrite queries. We try native Query.search for title/location first;
        // if the collection lacks a fulltext index, we retry without them and filter
        // client-side.
        const buildQueries = (useTitleSearch: boolean, useLocationSearch: boolean) => {
          const queries: any[] = [];

          if (useTitleSearch && filters.search && filters.search.trim()) {
            queries.push(Query.search("title", filters.search.trim()));
          }
          if (filters.category) {
            queries.push(Query.equal("category", filters.category));
          }
          if (filters.minPrice !== undefined) {
            queries.push(Query.greaterThanEqual("price", filters.minPrice));
          }
          if (filters.maxPrice !== undefined) {
            queries.push(Query.lessThanEqual("price", filters.maxPrice));
          }
          if (useLocationSearch && filters.location) {
            queries.push(Query.search("location", filters.location));
          }
          if (filters.condition) {
            queries.push(Query.equal("condition", filters.condition));
          }
          if (filters.userId) {
            queries.push(Query.equal("userId", filters.userId));
          }
          // Hide paused/sold listings from the public shop, unless filtering
          // by a specific seller (My Listings, Seller Profile) — they should
          // still see their full inventory.
          if (!filters.userId) {
            queries.push(Query.equal("status", "active"));
          }
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

          queries.push(Query.limit(filters.limit || 24));
          if (filters.offset) {
            queries.push(Query.offset(filters.offset));
          }
          return queries;
        };

        let response;
        let needClientFilter = false;
        try {
          response = await db.listDocuments(
            DB_ID,
            COLLECTIONS.PRODUCTS,
            buildQueries(true, true),
          );
        } catch (err: any) {
          // Fallback if fulltext index is missing on "title" or "location"
          if (
            err?.type === "index_not_found" ||
            /fulltext index/i.test(err?.message || "")
          ) {
            needClientFilter = true;
            response = await db.listDocuments(
              DB_ID,
              COLLECTIONS.PRODUCTS,
              buildQueries(false, false),
            );
          } else {
            throw err;
          }
        }

        let productList = response.documents.map(toProduct);
        let total = response.total;

        // Client-side filter for title/location if we couldn't use Appwrite search
        if (needClientFilter) {
          const q = filters.search?.trim().toLowerCase();
          const loc = filters.location?.trim().toLowerCase();
          productList = productList.filter((p) => {
            const matchQ = q ? (p.title || "").toLowerCase().includes(q) : true;
            const matchLoc = loc
              ? (p.location || "").toLowerCase().includes(loc)
              : true;
            return matchQ && matchLoc;
          });
          total = productList.length;
        }

        setProducts(productList);
        setTotalCount(total);

        return {
          success: true,
          message: "Products fetched successfully",
          data: { products: productList, total },
        };
      } catch (error: any) {
        console.error("Error searching products:", error);
        return { success: false, message: error.message, data: null };
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const getProductById = useCallback(
    async (productId: string): Promise<HookResponse> => {
      try {
        const result = await db.getDocument(
          DB_ID,
          COLLECTIONS.PRODUCTS,
          productId,
        );
        return {
          success: true,
          message: "Product fetched successfully",
          data: toProduct(result),
        };
      } catch (error: any) {
        console.error("Error fetching product:", error);
        return { success: false, message: error.message, data: null };
      }
    },
    [],
  );

  const getCategories = useCallback(async (): Promise<string[]> => {
    try {
      const response = await db.listDocuments(
        DB_ID,
        COLLECTIONS.PRODUCTS,
        [Query.limit(500)],
      );
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

  const getBrands = useCallback(async (): Promise<string[]> => {
    try {
      const response = await db.listDocuments(
        DB_ID,
        COLLECTIONS.PRODUCTS,
        [Query.limit(500)],
      );
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

  const getLocations = useCallback(async (): Promise<string[]> => {
    try {
      const response = await db.listDocuments(
        DB_ID,
        COLLECTIONS.PRODUCTS,
        [Query.limit(500)],
      );
      const locations = [
        ...new Set(
          response.documents
            .map((doc: any) => doc.location)
            .filter((loc: any) => loc && loc.trim()),
        ),
      ] as string[];
      return locations.sort();
    } catch (error) {
      console.error("Error fetching locations:", error);
      return [];
    }
  }, []);

  const getMyProducts = useCallback(
    async (userId: string): Promise<HookResponse> => {
      setIsLoading(true);
      try {
        const response = await db.listDocuments(
          DB_ID,
          COLLECTIONS.PRODUCTS,
          [Query.equal("userId", userId), Query.orderDesc("$createdAt")],
        );
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
        return { success: false, message: error.message, data: null };
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

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
        return { success: false, message: error.message, data: null };
      }
    },
    [],
  );

  const deleteProduct = useCallback(
    async (productId: string): Promise<HookResponse> => {
      try {
        await db.deleteDocument(DB_ID, COLLECTIONS.PRODUCTS, productId);
        setProducts((prev) => prev.filter((p) => p.id !== productId));
        return { success: true, message: "Product deleted successfully", data: null };
      } catch (error: any) {
        console.error("Error deleting product:", error);
        return { success: false, message: error.message, data: null };
      }
    },
    [],
  );

  const updateProduct = useCallback(
    async (
      productId: string,
      data: Partial<Product>,
    ): Promise<HookResponse> => {
      try {
        // Strip readonly fields that Appwrite rejects
        const { id, createdAt, updatedAt, ...payload } = data as any;
        const result = await db.updateDocument(
          DB_ID,
          COLLECTIONS.PRODUCTS,
          productId,
          payload,
        );
        const updated = toProduct(result);
        setProducts((prev) =>
          prev.map((p) => (String(p.id) === productId ? updated : p)),
        );
        return {
          success: true,
          message: "Product updated successfully",
          data: updated,
        };
      } catch (error: any) {
        console.error("Error updating product:", error);
        return { success: false, message: error.message, data: null };
      }
    },
    [],
  );

  return {
    products,
    isLoading,
    totalCount,
    searchProducts,
    getProductById,
    getCategories,
    getBrands,
    getLocations,
    getMyProducts,
    addProduct,
    deleteProduct,
    updateProduct,
  };
};

export default useProducts;
