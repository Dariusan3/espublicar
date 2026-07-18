import { createClient } from "@supabase/supabase-js";

// ============================================
// SUPABASE CLIENT
// ============================================
// Configuration comes from env vars in .env.local:
//   NEXT_PUBLIC_SUPABASE_URL
//   NEXT_PUBLIC_SUPABASE_ANON_KEY
// Fall back to a harmless placeholder so importing this module never throws
// before the real keys are wired up (createClient rejects an empty URL).
// Requests will fail at runtime until the env vars are set.
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export default supabase;

// ============================================
// DATABASE / TABLE CONFIGURATION
// ============================================
// Kept for compatibility with call sites that pass a DB id as the first arg.
// Supabase has no concept of a database id, so this is a no-op placeholder.
export const DB_ID = "";
export const DATABASE_ID = DB_ID;

// Table names (formerly Appwrite collection ids). Names are unchanged so the
// rest of the app keeps working without edits.
export const PRODUCTS_COLLECTION_ID = "products";
export const BLOGS_COLLECTION_ID = "blogs";
export const COLLECTIONS_COLLECTION_ID = "collections";
export const TESTIMONIALS_COLLECTION_ID = "testimonials";
export const ORDERS_COLLECTION_ID = "orders";
export const WISHLISTS_COLLECTION_ID = "wishlists";
export const CARTS_COLLECTION_ID = "carts";
export const USERS_COLLECTION_ID = "user";
export const REVIEWS_COLLECTION_ID = "reviews";
export const CONVERSATIONS_COLLECTION_ID = "conversations";
export const MESSAGES_COLLECTION_ID = "messages";
export const OFFERS_COLLECTION_ID = "offers";
export const NOTIFICATIONS_COLLECTION_ID = "notifications";
export const REPORTS_COLLECTION_ID = "reports";

export const COLLECTIONS = {
  PRODUCTS: PRODUCTS_COLLECTION_ID,
  BLOGS: BLOGS_COLLECTION_ID,
  COLLECTIONS: COLLECTIONS_COLLECTION_ID,
  TESTIMONIALS: TESTIMONIALS_COLLECTION_ID,
  ORDERS: ORDERS_COLLECTION_ID,
  WISHLISTS: WISHLISTS_COLLECTION_ID,
  CARTS: CARTS_COLLECTION_ID,
  USERS: USERS_COLLECTION_ID,
  REVIEWS: REVIEWS_COLLECTION_ID,
  CONVERSATIONS: CONVERSATIONS_COLLECTION_ID,
  MESSAGES: MESSAGES_COLLECTION_ID,
  OFFERS: OFFERS_COLLECTION_ID,
  NOTIFICATIONS: NOTIFICATIONS_COLLECTION_ID,
  REPORTS: REPORTS_COLLECTION_ID,
};

// ============================================
// STORAGE BUCKET CONFIGURATION
// ============================================
// Single public bucket, mirroring the previous single-bucket strategy.
export const STORAGE_BUCKET_ID =
  process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "images";

export const BUCKETS = {
  PRODUCT_IMAGES: STORAGE_BUCKET_ID,
  BLOG_IMAGES: STORAGE_BUCKET_ID,
  USER_AVATARS: STORAGE_BUCKET_ID,
};

// ============================================
// ID helper (Appwrite-compatible surface)
// ============================================
// `unique()` -> sentinel that tells createDocument to let Postgres generate the id.
// `custom(x)` -> use x as the row id (e.g. auth user id for the `user` table).
const UNIQUE_SENTINEL = "unique()";
export const ID = {
  unique: () => UNIQUE_SENTINEL,
  custom: (value) => value,
};
export const id = ID;

// ============================================
// Query builder (Appwrite-compatible surface)
// ============================================
// Each helper returns a plain descriptor that listDocuments() translates into
// PostgREST filters.
export const Query = {
  equal: (field, value) => ({ method: "equal", field, value }),
  notEqual: (field, value) => ({ method: "notEqual", field, value }),
  greaterThan: (field, value) => ({ method: "greaterThan", field, value }),
  greaterThanEqual: (field, value) => ({ method: "greaterThanEqual", field, value }),
  lessThan: (field, value) => ({ method: "lessThan", field, value }),
  lessThanEqual: (field, value) => ({ method: "lessThanEqual", field, value }),
  search: (field, value) => ({ method: "search", field, value }),
  contains: (field, value) => ({ method: "contains", field, value }),
  orderAsc: (field) => ({ method: "orderAsc", field }),
  orderDesc: (field) => ({ method: "orderDesc", field }),
  limit: (value) => ({ method: "limit", value }),
  offset: (value) => ({ method: "offset", value }),
};

export const query = Query;

// Map Appwrite system-field names to Postgres column names.
function mapField(field) {
  switch (field) {
    case "$id":
      return "id";
    case "$createdAt":
      return "created_at";
    case "$updatedAt":
      return "updated_at";
    default:
      return field;
  }
}

function wrapError(error) {
  const e = new Error(error?.message || "Supabase error");
  // PostgREST error codes are strings; keep a numeric `.code` too for the
  // `error?.code === 404` checks scattered across the hooks.
  e.type = error?.code;
  if (error?.code === "PGRST116") e.code = 404;
  return e;
}

// ============================================
// Database (Appwrite Databases-compatible surface)
// ============================================
async function listDocuments(_dbId, table, queries = []) {
  let builder = supabase.from(table).select("*", { count: "exact" });
  const orders = [];
  let limit;
  let offset;

  for (const q of queries || []) {
    const field = mapField(q.field);
    switch (q.method) {
      case "equal":
        builder = Array.isArray(q.value)
          ? builder.in(field, q.value)
          : builder.eq(field, q.value);
        break;
      case "notEqual":
        builder = builder.neq(field, q.value);
        break;
      case "greaterThan":
        builder = builder.gt(field, q.value);
        break;
      case "greaterThanEqual":
        builder = builder.gte(field, q.value);
        break;
      case "lessThan":
        builder = builder.lt(field, q.value);
        break;
      case "lessThanEqual":
        builder = builder.lte(field, q.value);
        break;
      case "search":
        builder = builder.ilike(field, `%${q.value}%`);
        break;
      case "contains":
        builder = builder.contains(
          field,
          Array.isArray(q.value) ? q.value : [q.value],
        );
        break;
      case "orderAsc":
        orders.push([field, true]);
        break;
      case "orderDesc":
        orders.push([field, false]);
        break;
      case "limit":
        limit = q.value;
        break;
      case "offset":
        offset = q.value;
        break;
      default:
        break;
    }
  }

  for (const [f, ascending] of orders) {
    builder = builder.order(f, { ascending });
  }

  if (limit != null) {
    const start = offset || 0;
    builder = builder.range(start, start + limit - 1);
  } else if (offset != null) {
    builder = builder.range(offset, offset + 999);
  }

  const { data, error, count } = await builder;
  if (error) throw wrapError(error);
  return { documents: data || [], total: count ?? (data ? data.length : 0) };
}

async function getDocument(_dbId, table, documentId) {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("id", documentId)
    .maybeSingle();
  if (error) throw wrapError(error);
  if (!data) {
    const e = new Error("Document not found");
    e.code = 404;
    throw e;
  }
  return data;
}

async function createDocument(_dbId, table, documentId, docData) {
  const payload = { ...docData };
  if (documentId && documentId !== UNIQUE_SENTINEL) {
    payload.id = documentId;
  }
  const { data, error } = await supabase
    .from(table)
    .insert(payload)
    .select()
    .single();
  if (error) throw wrapError(error);
  return data;
}

async function updateDocument(_dbId, table, documentId, docData) {
  const payload = { ...docData, updated_at: new Date().toISOString() };
  const { data, error } = await supabase
    .from(table)
    .update(payload)
    .eq("id", documentId)
    .select()
    .single();
  if (error) throw wrapError(error);
  return data;
}

async function deleteDocument(_dbId, table, documentId) {
  const { error } = await supabase.from(table).delete().eq("id", documentId);
  if (error) throw wrapError(error);
  return {};
}

export const db = {
  listDocuments,
  getDocument,
  createDocument,
  updateDocument,
  deleteDocument,
};
export const databases = db;

// ============================================
// Storage (Appwrite Storage-compatible surface)
// ============================================
export const storage = {
  async createFile(bucket, fileId, file) {
    const rawName =
      fileId && fileId !== UNIQUE_SENTINEL ? fileId : crypto.randomUUID();
    const ext = (file?.name?.split(".").pop() || "bin").toLowerCase();
    const path = `${rawName}.${ext}`;
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, { cacheControl: "3600", upsert: false });
    if (error) throw error;
    return { $id: data.path, id: data.path, bucketId: bucket };
  },
  getFileView(bucket, fileId) {
    return supabase.storage.from(bucket).getPublicUrl(fileId).data.publicUrl;
  },
  getFilePreview(bucket, fileId, ..._args) {
    // Image transforms require a paid plan; return the plain public URL.
    return supabase.storage.from(bucket).getPublicUrl(fileId).data.publicUrl;
  },
  async deleteFile(bucket, fileId) {
    const { error } = await supabase.storage.from(bucket).remove([fileId]);
    if (error) throw error;
    return {};
  },
  async listFiles(bucket) {
    const { data, error } = await supabase.storage.from(bucket).list();
    if (error) throw error;
    return {
      files: (data || []).map((f) => ({ $id: f.name, name: f.name })),
      total: data ? data.length : 0,
    };
  },
};

// ============================================
// Auth (Appwrite Account-compatible surface)
// ============================================
// Normalizes a Supabase user into the Appwrite-ish shape the app expects
// ($id, name, emailVerification, phoneVerification, prefs, ...).
function normalizeUser(user) {
  if (!user) return null;
  const meta = user.user_metadata || {};
  return {
    ...user,
    $id: user.id,
    id: user.id,
    $createdAt: user.created_at,
    name: meta.name || meta.full_name || meta.display_name || "",
    email: user.email || "",
    phone: user.phone || meta.phone || "",
    emailVerification: !!user.email_confirmed_at,
    phoneVerification: !!user.phone_confirmed_at,
    prefs: meta,
  };
}

export { normalizeUser };

// Accept both Appwrite object-style and positional call signatures.
function pick(obj, positional, key) {
  if (obj && typeof obj === "object") return obj[key];
  return positional;
}

export const account = {
  async get() {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      const e = new Error(error?.message || "No active session");
      e.code = 401;
      throw e;
    }
    return normalizeUser(data.user);
  },

  async create(a, b, c, d) {
    const email = pick(a, b, "email") ?? (typeof a === "object" ? a.email : b);
    const password =
      pick(a, c, "password") ?? (typeof a === "object" ? a.password : c);
    const name = typeof a === "object" ? a.name : d;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: name ? { data: { name } } : undefined,
    });
    if (error) throw error;
    return normalizeUser(data.user) || { $id: data.user?.id };
  },

  async createEmailPasswordSession(a, b) {
    const email = typeof a === "object" ? a.email : a;
    const password = typeof a === "object" ? a.password : b;
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return { $id: data.user?.id, ...normalizeUser(data.user) };
  },

  async deleteSession(..._args) {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  },

  async createOAuth2Session(provider, successUrl) {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: String(provider).toLowerCase(),
      options: { redirectTo: successUrl },
    });
    if (error) throw error;
  },

  async updateName(a) {
    const name = typeof a === "object" ? a.name : a;
    const { data, error } = await supabase.auth.updateUser({ data: { name } });
    if (error) throw error;
    return normalizeUser(data.user);
  },

  async updateEmail(a) {
    const email = typeof a === "object" ? a.email : a;
    const { data, error } = await supabase.auth.updateUser({ email });
    if (error) throw error;
    return normalizeUser(data.user);
  },

  async updatePassword(a) {
    const password = typeof a === "object" ? a.password : a;
    const { data, error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
    return normalizeUser(data.user);
  },

  async updatePhone(a) {
    const phone = typeof a === "object" ? a.phone : a;
    const { data, error } = await supabase.auth.updateUser({ phone });
    if (error) throw error;
    return normalizeUser(data.user);
  },

  async createRecovery(a, b) {
    const email = typeof a === "object" ? a.email : a;
    const url = typeof a === "object" ? a.url : b;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: url,
    });
    if (error) throw error;
    return true;
  },

  // Supabase completes recovery via the link (which sets a session); the new
  // password is then applied with updateUser.
  async updateRecovery(a, b, c) {
    const password = typeof a === "object" ? a.password : c;
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
    return true;
  },

  // Resend the signup confirmation email.
  async createVerification(..._args) {
    const { data } = await supabase.auth.getUser();
    if (data?.user?.email) {
      await supabase.auth.resend({ type: "signup", email: data.user.email });
    }
    return true;
  },

  // Email verification is handled by the confirmation link.
  async updateVerification(..._args) {
    return true;
  },

  async createPhoneVerification(..._args) {
    const { data } = await supabase.auth.getUser();
    if (data?.user?.phone) {
      await supabase.auth.resend({
        type: "phone_change",
        phone: data.user.phone,
      });
    }
    return true;
  },

  async updatePhoneVerification(_userId, token) {
    const { data } = await supabase.auth.getUser();
    const { error } = await supabase.auth.verifyOtp({
      phone: data?.user?.phone,
      token,
      type: "phone_change",
    });
    if (error) throw error;
    return true;
  },
};
