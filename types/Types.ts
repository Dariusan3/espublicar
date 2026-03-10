export interface HookResponse {
  success: boolean;
  message: string;
  data?: any;
}

// ==================== Appwrite Collection Types ====================

export interface UserDB {
  name?: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
}
export interface User extends UserDB {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Product collection interface
 * Collection ID: products
 */
export interface ProductDB {
  title: string;
  price: number;
  oldprice?: number;
  category?: string;
  imgSrc: string;
  imgHover?: string;
  thumbImages?: string[];
  description?: string;
  rating?: number;
  inStock?: boolean;
  isNew?: boolean;
  isTodaysDeals?: boolean;
  hotSale?: boolean;
  salePercentage?: string;
  filterBrands?: string[];
  sold?: number;
  available?: number;
  userId: string; // Owner of the product
  condition?: string; // New, Like New, etc.
  location?: string; // City/Town
  isNegotiable?: boolean; // If price can be negotiated
}

export interface Product extends ProductDB {
  id: string | number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Blog collection interface
 * Collection ID: blogs
 */
export interface BlogDB {
  title: string;
  content?: string;
  description?: string;
  imgSrc: string;
  tag?: string;
  date?: string;
  author?: string;
}

export interface Blog extends BlogDB {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Collection (product category/banner) interface
 * Collection ID: collections
 */
export interface CollectionDB {
  title: string;
  imgSrc: string;
  sale?: string;
  productText?: string;
  darkText?: boolean;
}

export interface Collection extends CollectionDB {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Testimonial/Review interface
 * Collection ID: testimonials
 */
export interface TestimonialDB {
  name: string;
  imgSrc: string;
  text: string;
  rating: number;
  date?: string;
  verified?: boolean;
  productColor?: string;
}

export interface Testimonial extends TestimonialDB {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Order interface
 * Collection ID: orders
 */
export interface OrderDB {
  userId: string;
  items: string; // JSON string of cart items
  totalAmount: number;
  status: string;
  shippingAddress: string;
  paymentMethod?: string;
  paymentStatus?: string;
  trackingNumber?: string;
  notes?: string;
}

export interface Order extends OrderDB {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Wishlist item interface
 * Collection ID: wishlists
 */
export interface WishlistDB {
  userId: string;
  productId: string;
}

export interface Wishlist extends WishlistDB {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Cart item interface
 * Collection ID: carts
 */
export interface CartDB {
  userId: string;
  productId: string;
  quantity: number;
}

export interface Cart extends CartDB {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Review/Testimonial extension for specific products
 * Collection ID: reviews
 */
export interface ReviewDB {
  userId: string;
  userName: string;
  userAvatar?: string;
  productId: string;
  rating: number;
  title?: string;
  content: string;
  verified?: boolean;
}

export interface Review extends ReviewDB {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Conversation interface
 * Collection ID: conversations
 */
export interface ConversationDB {
  participants: string[]; // Array of user IDs
  productId: string;
  lastMessage?: string;
  lastMessageAuthorId?: string;
  lastMessageAt?: string;
}

export interface Conversation extends ConversationDB {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Message interface
 * Collection ID: messages
 */
export interface MessageDB {
  conversationId: string;
  senderId: string;
  text: string;
  isRead: boolean;
}

export interface Message extends MessageDB {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== Helper Types ====================

/**
 * Parsed order items (for when items JSON is parsed)
 */
export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  imgSrc?: string;
}

/**
 * Order status options
 */
export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

/**
 * Payment status options
 */
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
