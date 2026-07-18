"use client";
import { useCallback } from "react";
import { databases, DATABASE_ID, COLLECTIONS, Query, ID } from "@/lib/supabase";

/**
 * Custom hook for database operations with Supabase
 */
const useDatabase = () => {
  /**
   * Fetch all products with optional filtering
   */
  const getProducts = useCallback(async (filters: any = {}) => {
    try {
      const queries = [];

      if (filters.category) {
        queries.push(Query.equal("category", filters.category));
      }
      if (filters.minPrice) {
        queries.push(Query.greaterThanEqual("price", filters.minPrice));
      }
      if (filters.maxPrice) {
        queries.push(Query.lessThanEqual("price", filters.maxPrice));
      }
      if (filters.limit) {
        queries.push(Query.limit(filters.limit));
      }
      if (filters.offset) {
        queries.push(Query.offset(filters.offset));
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.PRODUCTS,
        queries,
      );

      return {
        success: true,
        message: "Products fetched successfully!",
        data: response.documents,
      };
    } catch (error: any) {
      console.error("Error fetching products:", error);
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  }, []);

  /**
   * Fetch a single product by ID
   */
  const getProductById = useCallback(async (productId: string) => {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.PRODUCTS,
        productId,
      );

      return {
        success: true,
        message: "Product fetched successfully!",
        data: response,
      };
    } catch (error: any) {
      console.error("Error fetching product:", error);
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  }, []);

  /**
   * Fetch all blog posts
   */
  const getBlogs = useCallback(async (limit = 10) => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.BLOGS,
        [Query.limit(limit), Query.orderDesc("$createdAt")],
      );

      return {
        success: true,
        message: "Blogs fetched successfully!",
        data: response.documents,
      };
    } catch (error: any) {
      console.error("Error fetching blogs:", error);
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  }, []);

  /**
   * Fetch a single blog by ID
   */
  const getBlogById = useCallback(async (blogId: string) => {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.BLOGS,
        blogId,
      );

      return {
        success: true,
        message: "Blog fetched successfully!",
        data: response,
      };
    } catch (error: any) {
      console.error("Error fetching blog:", error);
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  }, []);

  /**
   * Fetch all collections
   */
  const getCollections = useCallback(async () => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.COLLECTIONS,
      );

      return {
        success: true,
        message: "Collections fetched successfully!",
        data: response.documents,
      };
    } catch (error: any) {
      console.error("Error fetching collections:", error);
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  }, []);

  /**
   * Fetch all testimonials
   */
  const getTestimonials = useCallback(async () => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.TESTIMONIALS,
      );

      return {
        success: true,
        message: "Testimonials fetched successfully!",
        data: response.documents,
      };
    } catch (error: any) {
      console.error("Error fetching testimonials:", error);
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  }, []);

  /**
   * Create a new document in a collection
   */
  const createDocument = useCallback(
    async (
      collectionId: string,
      data: any,
      documentId: string = ID.unique(),
    ) => {
      try {
        const response = await databases.createDocument(
          DATABASE_ID,
          collectionId,
          documentId,
          data,
        );

        return {
          success: true,
          message: "Document created successfully!",
          data: response,
        };
      } catch (error: any) {
        console.error("Error creating document:", error);
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
   * Update a document in a collection
   */
  const updateDocument = useCallback(
    async (collectionId: string, documentId: string, data: any) => {
      try {
        const response = await databases.updateDocument(
          DATABASE_ID,
          collectionId,
          documentId,
          data,
        );

        return {
          success: true,
          message: "Document updated successfully!",
          data: response,
        };
      } catch (error: any) {
        console.error("Error updating document:", error);
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
   * Delete a document from a collection
   */
  const deleteDocument = useCallback(
    async (collectionId: string, documentId: string) => {
      try {
        await databases.deleteDocument(DATABASE_ID, collectionId, documentId);

        return {
          success: true,
          message: "Document deleted successfully!",
          data: null,
        };
      } catch (error: any) {
        console.error("Error deleting document:", error);
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
    getProducts,
    getProductById,
    getBlogs,
    getBlogById,
    getCollections,
    getTestimonials,
    createDocument,
    updateDocument,
    deleteDocument,
  };
};

export default useDatabase;
