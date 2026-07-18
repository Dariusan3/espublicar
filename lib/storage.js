import { storage, BUCKETS, ID } from "./supabase";

/**
 * Get the public URL for a file stored in a Supabase Storage bucket.
 */
export function getFileUrl(bucketId, fileId) {
  if (!bucketId || !fileId) return "";
  return storage.getFileView(bucketId, fileId);
}

/**
 * Get product image URL
 */
export function getProductImageUrl(fileId) {
  return getFileUrl(BUCKETS.PRODUCT_IMAGES, fileId);
}

/**
 * Get blog image URL
 */
export function getBlogImageUrl(fileId) {
  return getFileUrl(BUCKETS.BLOG_IMAGES, fileId);
}

/**
 * Get user avatar URL
 */
export function getUserAvatarUrl(fileId) {
  return getFileUrl(BUCKETS.USER_AVATARS, fileId);
}

/**
 * Upload a file to a bucket
 */
export async function uploadFile(bucketId, file) {
  try {
    const response = await storage.createFile(bucketId, ID.unique(), file);
    return response;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

/**
 * Upload product image
 */
export async function uploadProductImage(file) {
  return uploadFile(BUCKETS.PRODUCT_IMAGES, file);
}

/**
 * Upload blog image
 */
export async function uploadBlogImage(file) {
  return uploadFile(BUCKETS.BLOG_IMAGES, file);
}

/**
 * Upload user avatar
 */
export async function uploadUserAvatar(file) {
  return uploadFile(BUCKETS.USER_AVATARS, file);
}

/**
 * Delete a file from storage
 */
export async function deleteFile(bucketId, fileId) {
  try {
    await storage.deleteFile(bucketId, fileId);
    return true;
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
}
