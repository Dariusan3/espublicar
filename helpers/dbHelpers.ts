import { Models } from "appwrite";
import {
  Product,
  Blog,
  Collection,
  Testimonial,
  User,
  Order,
  Wishlist,
  Cart,
  OrderItem,
} from "@/types/Types";

/**
 * Helper type for Appwrite Documents with dynamic properties
 */
type DocumentData = Models.Document & {
  [key: string]: any;
};

/**
 * Convert Appwrite Document to Product type
 */
export const toProduct = (doc: DocumentData): Product => ({
  id: doc.$id,
  createdAt: doc.$createdAt,
  updatedAt: doc.$updatedAt,
  title: doc.title,
  price: doc.price,
  oldprice: doc.oldprice,
  category: doc.category,
  imgSrc: doc.imgSrc,
  imgHover: doc.imgHover,
  thumbImages: Array.isArray(doc.thumbImages) ? doc.thumbImages : [],
  description: doc.description,
  rating: doc.rating ?? 0,
  inStock: doc.inStock ?? true,
  isNew: doc.isNew ?? false,
  isTodaysDeals: doc.isTodaysDeals ?? false,
  hotSale: doc.hotSale ?? false,
  salePercentage: doc.salePercentage,
  filterBrands: Array.isArray(doc.filterBrands) ? doc.filterBrands : [],
  sold: doc.sold ?? 0,
  available: doc.available ?? 0,
});

/**
 * Convert Appwrite Document to Blog type
 */
export const toBlog = (doc: DocumentData): Blog => ({
  id: doc.$id,
  createdAt: doc.$createdAt,
  updatedAt: doc.$updatedAt,
  title: doc.title,
  content: doc.content,
  description: doc.description,
  imgSrc: doc.imgSrc,
  tag: doc.tag,
  date: doc.date,
  author: doc.author,
});

/**
 * Convert Appwrite Document to Collection type
 */
export const toCollection = (doc: DocumentData): Collection => ({
  id: doc.$id,
  createdAt: doc.$createdAt,
  updatedAt: doc.$updatedAt,
  title: doc.title,
  imgSrc: doc.imgSrc,
  sale: doc.sale,
  productText: doc.productText,
  darkText: doc.darkText ?? false,
});

/**
 * Convert Appwrite Document to Testimonial type
 */
export const toTestimonial = (doc: DocumentData): Testimonial => ({
  id: doc.$id,
  createdAt: doc.$createdAt,
  updatedAt: doc.$updatedAt,
  name: doc.name,
  imgSrc: doc.imgSrc,
  text: doc.text,
  rating: doc.rating,
  date: doc.date,
  verified: doc.verified ?? false,
  productColor: doc.productColor,
});

/**
 * Convert Appwrite Document to UserProfile type
 */
export const toUser = (doc: DocumentData): User => ({
  id: doc.$id,
  createdAt: doc.$createdAt,
  updatedAt: doc.$updatedAt,
  name: doc.name,
  email: doc.email,
  phone: doc.phone,
  avatarUrl: doc.avatarUrl,
  address: doc.address,
  city: doc.city,
  country: doc.country,
  postalCode: doc.postalCode,
});

/**
 * Convert Appwrite Document to Order type
 */
export const toOrder = (doc: DocumentData): Order => ({
  id: doc.$id,
  createdAt: doc.$createdAt,
  updatedAt: doc.$updatedAt,
  userId: doc.userId,
  items: doc.items,
  totalAmount: doc.totalAmount,
  status: doc.status ?? "pending",
  shippingAddress: doc.shippingAddress,
  paymentMethod: doc.paymentMethod,
  paymentStatus: doc.paymentStatus ?? "pending",
  trackingNumber: doc.trackingNumber,
  notes: doc.notes,
});

/**
 * Convert Appwrite Document to WishlistItem type
 */
export const toWishlistItem = (doc: DocumentData): Wishlist => ({
  id: doc.$id,
  createdAt: doc.$createdAt,
  updatedAt: doc.$updatedAt,
  userId: doc.userId,
  productId: doc.productId,
});

/**
 * Convert Appwrite Document to Cart type
 */
export const toCart = (doc: DocumentData): Cart => ({
  id: doc.$id,
  createdAt: doc.$createdAt,
  updatedAt: doc.$updatedAt,
  userId: doc.userId,
  productId: doc.productId,
  quantity: doc.quantity ?? 1,
});

/**
 * Parse order items JSON string to OrderItem array
 */
export const parseOrderItems = (itemsJson: string): OrderItem[] => {
  try {
    const items = JSON.parse(itemsJson);
    return Array.isArray(items) ? items : [];
  } catch (error) {
    console.error("Failed to parse order items:", error);
    return [];
  }
};

/**
 * Convert OrderItem array to JSON string for storage
 */
export const stringifyOrderItems = (items: OrderItem[]): string => {
  try {
    return JSON.stringify(items);
  } catch (error) {
    console.error("Failed to stringify order items:", error);
    return "[]";
  }
};

/**
 * Batch convert array of Documents to typed array
 */
export const toProducts = (docs: DocumentData[]): Product[] =>
  docs.map(toProduct);

export const toBlogs = (docs: DocumentData[]): Blog[] => docs.map(toBlog);

export const toCollections = (docs: DocumentData[]): Collection[] =>
  docs.map(toCollection);

export const toTestimonials = (docs: DocumentData[]): Testimonial[] =>
  docs.map(toTestimonial);

export const toUsers = (docs: DocumentData[]): User[] => docs.map(toUser);

export const toOrders = (docs: DocumentData[]): Order[] => docs.map(toOrder);

export const toWishlistItems = (docs: DocumentData[]): Wishlist[] =>
  docs.map(toWishlistItem);

export const toCarts = (docs: DocumentData[]): Cart[] => docs.map(toCart);
