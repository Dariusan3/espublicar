import {
  Product,
  Blog,
  Collection,
  Testimonial,
  User,
  Order,
  Wishlist,
  Cart,
  Review,
  OrderItem,
  Conversation,
  Message,
  Offer,
  Notification,
} from "@/types/Types";

/**
 * Helper type for Supabase rows with dynamic properties.
 */
type DocumentData = {
  id: string;
  created_at: string;
  updated_at: string;
  [key: string]: any;
};

/**
 * Convert Supabase row to Product type
 */
export const toProduct = (doc: DocumentData): Product => ({
  id: doc.id,
  createdAt: doc.created_at,
  updatedAt: doc.updated_at,
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
  available: doc.available ?? 0,
  userId: doc.userId,
  condition: doc.condition,
  location: doc.location,
  isNegotiable: doc.isNegotiable ?? false,
  status: doc.status ?? "active",
  views: doc.views ?? 0,
});

/**
 * Convert Supabase row to Blog type
 */
export const toBlog = (doc: DocumentData): Blog => ({
  id: doc.id,
  createdAt: doc.created_at,
  updatedAt: doc.updated_at,
  title: doc.title,
  content: doc.content,
  description: doc.description,
  imgSrc: doc.imgSrc,
  tag: doc.tag,
  date: doc.date,
  author: doc.author,
});

/**
 * Convert Supabase row to Collection type
 */
export const toCollection = (doc: DocumentData): Collection => ({
  id: doc.id,
  createdAt: doc.created_at,
  updatedAt: doc.updated_at,
  title: doc.title,
  imgSrc: doc.imgSrc,
  sale: doc.sale,
  productText: doc.productText,
  darkText: doc.darkText ?? false,
});

/**
 * Convert Supabase row to Testimonial type
 */
export const toTestimonial = (doc: DocumentData): Testimonial => ({
  id: doc.id,
  createdAt: doc.created_at,
  updatedAt: doc.updated_at,
  name: doc.name,
  imgSrc: doc.imgSrc,
  text: doc.text,
  rating: doc.rating,
  date: doc.date,
  verified: doc.verified ?? false,
  productColor: doc.productColor,
});

/**
 * Convert Supabase row to UserProfile type
 */
export const toUser = (doc: DocumentData): User => ({
  id: doc.id,
  createdAt: doc.created_at,
  updatedAt: doc.updated_at,
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
 * Convert Supabase row to Order type
 */
export const toOrder = (doc: DocumentData): Order => ({
  id: doc.id,
  createdAt: doc.created_at,
  updatedAt: doc.updated_at,
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
 * Convert Supabase row to WishlistItem type
 */
export const toWishlistItem = (doc: DocumentData): Wishlist => ({
  id: doc.id,
  createdAt: doc.created_at,
  updatedAt: doc.updated_at,
  userId: doc.userId,
  productId: doc.productId,
});

/**
 * Convert Supabase row to Cart type
 */
export const toCart = (doc: DocumentData): Cart => ({
  id: doc.id,
  createdAt: doc.created_at,
  updatedAt: doc.updated_at,
  userId: doc.userId,
  productId: doc.productId,
  quantity: doc.quantity ?? 1,
});

/**
 * Convert Supabase row to Review type
 */
export const toReview = (doc: DocumentData): Review => ({
  id: doc.id,
  createdAt: doc.created_at,
  updatedAt: doc.updated_at,
  userId: doc.userId,
  userName: doc.userName,
  userAvatar: doc.userAvatar,
  productId: doc.productId,
  rating: doc.rating,
  title: doc.title,
  content: doc.content,
  verified: doc.verified ?? false,
});

/**
 * Convert Supabase row to Conversation type
 */
export const toConversation = (doc: DocumentData): Conversation => ({
  id: doc.id,
  createdAt: doc.created_at,
  updatedAt: doc.updated_at,
  participants: Array.isArray(doc.participants) ? doc.participants : [],
  productId: doc.productId,
  lastMessage: doc.lastMessage,
  lastMessageAuthorId: doc.lastMessageAuthorId,
  lastMessageAt: doc.lastMessageAt,
});

/**
 * Convert Supabase row to Message type
 */
export const toMessage = (doc: DocumentData): Message => ({
  id: doc.id,
  createdAt: doc.created_at,
  updatedAt: doc.updated_at,
  conversationId: doc.conversationId,
  senderId: doc.senderId,
  text: doc.text,
  isRead: doc.isRead ?? false,
  type: doc.type ?? "text",
  offerId: doc.offerId ?? null,
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

export const toReviews = (docs: DocumentData[]): Review[] => docs.map(toReview);

export const toConversations = (docs: DocumentData[]): Conversation[] =>
  docs.map(toConversation);

export const toMessages = (docs: DocumentData[]): Message[] =>
  docs.map(toMessage);

/**
 * Convert Supabase row to Offer type
 */
export const toOffer = (doc: DocumentData): Offer => ({
  id: doc.id,
  createdAt: doc.created_at,
  updatedAt: doc.updated_at,
  productId: doc.productId,
  buyerId: doc.buyerId,
  sellerId: doc.sellerId,
  amount: doc.amount,
  status: doc.status ?? "pending",
  counterAmount: doc.counterAmount,
  message: doc.message,
});

export const toOffers = (docs: DocumentData[]): Offer[] => docs.map(toOffer);

/**
 * Convert Supabase row to Notification type
 */
export const toNotification = (doc: DocumentData): Notification => ({
  id: doc.id,
  createdAt: doc.created_at,
  updatedAt: doc.updated_at,
  userId: doc.userId,
  type: doc.type ?? "system",
  title: doc.title,
  body: doc.body,
  referenceId: doc.referenceId,
  referenceType: doc.referenceType,
  isRead: doc.isRead ?? false,
});

export const toNotifications = (docs: DocumentData[]): Notification[] =>
  docs.map(toNotification);
