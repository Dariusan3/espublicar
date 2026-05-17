import { storage, BUCKETS, ID } from "./appwrite";

const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const ENDPOINT =
  process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ||
  "https://cloud.appwrite.io/v1";

/**
 * Build a canonical public URL for a file in Appwrite storage.
 * Format: {endpoint}/storage/buckets/{bucketId}/files/{fileId}/view?project={projectId}
 * This is stable, no SDK mystery objects, safe to save in the DB.
 */
function buildFileUrl(bucketId, fileId) {
  if (!bucketId || !fileId) return "";
  return `${ENDPOINT}/storage/buckets/${bucketId}/files/${fileId}/view?project=${PROJECT_ID}`;
}

/**
 * Get a file view URL (full-size, no transformations — works on Free plan).
 */
export function getFileUrl(bucketId, fileId) {
  return buildFileUrl(bucketId, fileId);
}

/**
 * Get product image URL
 */
export function getProductImageUrl(fileId) {
  return buildFileUrl(BUCKETS.PRODUCT_IMAGES, fileId);
}

/**
 * Get blog image URL
 */
export function getBlogImageUrl(fileId) {
  return buildFileUrl(BUCKETS.BLOG_IMAGES, fileId);
}

/**
 * Get user avatar URL
 */
export function getUserAvatarUrl(fileId) {
  return buildFileUrl(BUCKETS.USER_AVATARS, fileId);
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
