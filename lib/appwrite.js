import { Client, Account, Databases, Storage, ID, Functions, Query } from "appwrite";

// Initialize the Appwrite client
const client = new Client();

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

// Export Appwrite services
export const account = new Account(client);
export const db = new Databases(client);
export const databases = new Databases(client); // Alias for compatibility
export const storage = new Storage(client);
export const functions = new Functions(client);
export const query = Query;
export const id = ID;

// Also export with uppercase for consistency
export { ID, Query };

// ============================================
// DATABASE CONFIGURATION
// ============================================
export const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";
export const DATABASE_ID = DB_ID; // Alias for compatibility

// ============================================
// COLLECTION IDs
// Replace these with your actual collection IDs from Appwrite Console
// ============================================
export const PRODUCTS_COLLECTION_ID = "products";
export const BLOGS_COLLECTION_ID = "blogs";
export const COLLECTIONS_COLLECTION_ID = "collections";
export const TESTIMONIALS_COLLECTION_ID = "testimonials";
export const ORDERS_COLLECTION_ID = "orders";
export const WISHLISTS_COLLECTION_ID = "wishlists";
export const CARTS_COLLECTION_ID = "carts";
export const USERS_COLLECTION_ID = "user";

// Collection IDs object for easy access
export const COLLECTIONS = {
  PRODUCTS: PRODUCTS_COLLECTION_ID,
  BLOGS: BLOGS_COLLECTION_ID,
  COLLECTIONS: COLLECTIONS_COLLECTION_ID,
  TESTIMONIALS: TESTIMONIALS_COLLECTION_ID,
  ORDERS: ORDERS_COLLECTION_ID,
  WISHLISTS: WISHLISTS_COLLECTION_ID,
  CARTS: CARTS_COLLECTION_ID,
  USERS: USERS_COLLECTION_ID,
};

// ============================================
// STORAGE BUCKET IDs
// Replace these with your actual bucket IDs from Appwrite Console
// ============================================
// Using single bucket for Free Plan limits
export const STORAGE_BUCKET_ID = "storage"; // Name your bucket 'storage' in Appwrite

// Bucket IDs object for easy access (mapped to single bucket)
export const BUCKETS = {
  PRODUCT_IMAGES: STORAGE_BUCKET_ID,
  BLOG_IMAGES: STORAGE_BUCKET_ID,
  USER_AVATARS: STORAGE_BUCKET_ID,
};

// ============================================
// FUNCTION IDs
// Replace these with your actual function IDs from Appwrite Console
// ============================================
export const CONTACT_FUNCTION_ID = "";
export const EMAIL_NOTIFICATION_FUNCTION_ID = "";
export const ORDER_PROCESSING_FUNCTION_ID = "";

// Function IDs object for easy access
export const FUNCTIONS = {
  CONTACT: CONTACT_FUNCTION_ID,
  EMAIL_NOTIFICATION: EMAIL_NOTIFICATION_FUNCTION_ID,
  ORDER_PROCESSING: ORDER_PROCESSING_FUNCTION_ID,
};

export default client;
