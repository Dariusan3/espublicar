"use client";
import { useCallback } from "react";
import { storage, BUCKETS, ID } from "@/lib/appwrite";

/**
 * Custom hook for storage operations with Appwrite
 */
const useStorage = () => {
  /**
   * Get a file preview URL
   */
  const getFileUrl = useCallback(
    (bucketId: string, fileId: string, width = 0, height = 0) => {
      try {
        if (width && height) {
          return {
            success: true,
            message: "File URL generated!",
            data: storage.getFilePreview(bucketId, fileId, width, height),
          };
        }
        return {
          success: true,
          message: "File URL generated!",
          data: storage.getFileView(bucketId, fileId),
        };
      } catch (error: any) {
        console.error("Error getting file URL:", error);
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
   * Get product image URL
   * Note: Uses main storage bucket
   */
  const getProductImageUrl = useCallback(
    (fileId: string, width = 500, height = 500) => {
      return getFileUrl(BUCKETS.PRODUCT_IMAGES, fileId, width, height);
    },
    [getFileUrl],
  );

  /**
   * Get blog image URL
   */
  const getBlogImageUrl = useCallback(
    (fileId: string, width = 800, height = 450) => {
      return getFileUrl(BUCKETS.BLOG_IMAGES, fileId, width, height);
    },
    [getFileUrl],
  );

  /**
   * Get user avatar URL
   */
  const getUserAvatarUrl = useCallback(
    (fileId: string, width = 100, height = 100) => {
      return getFileUrl(BUCKETS.USER_AVATARS, fileId, width, height);
    },
    [getFileUrl],
  );

  /**
   * Upload a file to a bucket
   */
  const uploadFile = useCallback(async (bucketId: string, file: File) => {
    try {
      const response = await storage.createFile(bucketId, ID.unique(), file);

      return {
        success: true,
        message: "File uploaded successfully!",
        data: response,
      };
    } catch (error: any) {
      console.error("Error uploading file:", error);
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  }, []);

  /**
   * Upload product image
   */
  const uploadProductImage = useCallback(
    async (file: File) => {
      return uploadFile(BUCKETS.PRODUCT_IMAGES, file);
    },
    [uploadFile],
  );

  /**
   * Upload blog image
   */
  const uploadBlogImage = useCallback(
    async (file: File) => {
      return uploadFile(BUCKETS.BLOG_IMAGES, file);
    },
    [uploadFile],
  );

  /**
   * Upload user avatar
   */
  const uploadUserAvatar = useCallback(
    async (file: File) => {
      return uploadFile(BUCKETS.USER_AVATARS, file);
    },
    [uploadFile],
  );

  /**
   * Delete a file from storage
   */
  const deleteFile = useCallback(async (bucketId: string, fileId: string) => {
    try {
      await storage.deleteFile(bucketId, fileId);

      return {
        success: true,
        message: "File deleted successfully!",
        data: null,
      };
    } catch (error: any) {
      console.error("Error deleting file:", error);
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  }, []);

  /**
   * List files in a bucket
   */
  const listFiles = useCallback(async (bucketId: string) => {
    try {
      const response = await storage.listFiles(bucketId);

      return {
        success: true,
        message: "Files listed successfully!",
        data: response.files,
      };
    } catch (error: any) {
      console.error("Error listing files:", error);
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  }, []);

  /**
   * Upload multiple product images in parallel
   * Returns array of file IDs
   */
  const uploadMultipleProductImages = useCallback(
    async (files: File[]) => {
      try {
        const results = await Promise.all(
          files.map((file) => uploadProductImage(file)),
        );

        const failed = results.filter((r) => !r.success);
        if (failed.length > 0) {
          return {
            success: false,
            message: `${failed.length} of ${files.length} uploads failed`,
            data: results.filter((r) => r.success).map((r) => r.data),
          };
        }

        return {
          success: true,
          message: "All images uploaded successfully!",
          data: results.map((r) => r.data),
        };
      } catch (error: any) {
        console.error("Error uploading multiple images:", error);
        return {
          success: false,
          message: error.message,
          data: null,
        };
      }
    },
    [uploadProductImage],
  );

  return {
    getFileUrl,
    getProductImageUrl,
    getBlogImageUrl,
    getUserAvatarUrl,
    uploadFile,
    uploadProductImage,
    uploadBlogImage,
    uploadUserAvatar,
    uploadMultipleProductImages,
    deleteFile,
    listFiles,
  };
};

export default useStorage;
