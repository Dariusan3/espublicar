import { storage, BUCKETS, ID } from './appwrite';

/**
 * Get a file preview URL
 */
export function getFileUrl(bucketId, fileId, width = 0, height = 0) {
  try {
    if (width && height) {
      return storage.getFilePreview(bucketId, fileId, width, height);
    }
    return storage.getFileView(bucketId, fileId);
  } catch (error) {
    console.error('Error getting file URL:', error);
    throw error;
  }
}

/**
 * Get product image URL
 */
export function getProductImageUrl(fileId, width = 500, height = 500) {
  return getFileUrl(BUCKETS.PRODUCT_IMAGES, fileId, width, height);
}

/**
 * Get blog image URL
 */
export function getBlogImageUrl(fileId, width = 800, height = 450) {
  return getFileUrl(BUCKETS.BLOG_IMAGES, fileId, width, height);
}

/**
 * Get user avatar URL
 */
export function getUserAvatarUrl(fileId, width = 100, height = 100) {
  return getFileUrl(BUCKETS.USER_AVATARS, fileId, width, height);
}

/**
 * Upload a file to a bucket
 */
export async function uploadFile(bucketId, file) {
  try {
    const response = await storage.createFile(
      bucketId,
      ID.unique(),
      file
    );
    return response;
  } catch (error) {
    console.error('Error uploading file:', error);
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
    console.error('Error deleting file:', error);
    throw error;
  }
}
