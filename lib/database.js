import { databases, DATABASE_ID, COLLECTIONS, Query, ID } from './appwrite';

/**
 * Fetch all products with optional filtering
 */
export async function getProducts(filters = {}) {
  try {
    const queries = [];
    
    if (filters.category) {
      queries.push(Query.equal('category', filters.category));
    }
    if (filters.minPrice) {
      queries.push(Query.greaterThanEqual('price', filters.minPrice));
    }
    if (filters.maxPrice) {
      queries.push(Query.lessThanEqual('price', filters.maxPrice));
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
      queries
    );
    
    return response.documents;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

/**
 * Fetch a single product by ID
 */
export async function getProductById(productId) {
  try {
    const response = await databases.getDocument(
      DATABASE_ID,
      COLLECTIONS.PRODUCTS,
      productId
    );
    return response;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

/**
 * Fetch all blog posts
 */
export async function getBlogs(limit = 10) {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.BLOGS,
      [Query.limit(limit), Query.orderDesc('$createdAt')]
    );
    return response.documents;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw error;
  }
}

/**
 * Fetch a single blog by ID
 */
export async function getBlogById(blogId) {
  try {
    const response = await databases.getDocument(
      DATABASE_ID,
      COLLECTIONS.BLOGS,
      blogId
    );
    return response;
  } catch (error) {
    console.error('Error fetching blog:', error);
    throw error;
  }
}

/**
 * Fetch all collections
 */
export async function getCollections() {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.COLLECTIONS
    );
    return response.documents;
  } catch (error) {
    console.error('Error fetching collections:', error);
    throw error;
  }
}

/**
 * Fetch all testimonials
 */
export async function getTestimonials() {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.TESTIMONIALS
    );
    return response.documents;
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    throw error;
  }
}

/**
 * Create a new order
 */
export async function createOrder(orderData) {
  try {
    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.ORDERS,
      ID.unique(),
      orderData
    );
    return response;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

/**
 * Get user's wishlist
 */
export async function getUserWishlist(userId) {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.WISHLISTS,
      [Query.equal('userId', userId)]
    );
    return response.documents;
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    throw error;
  }
}

/**
 * Add item to wishlist
 */
export async function addToWishlist(userId, productId) {
  try {
    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.WISHLISTS,
      ID.unique(),
      { userId, productId }
    );
    return response;
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    throw error;
  }
}

/**
 * Remove item from wishlist
 */
export async function removeFromWishlist(wishlistItemId) {
  try {
    await databases.deleteDocument(
      DATABASE_ID,
      COLLECTIONS.WISHLISTS,
      wishlistItemId
    );
    return true;
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    throw error;
  }
}
