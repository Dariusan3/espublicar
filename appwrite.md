# Appwrite Database Schemas

Current attribute schemas and configuration for your e-commerce app.

---

## 1. `products` Collection

**ID:** `products`

| Attribute        | Type     | Size | Required | Default | Description           |
| ---------------- | -------- | ---- | -------- | ------- | --------------------- |
| `productId`      | Integer  | -    | ✅       | -       | Original Numeric ID   |
| `title`          | String   | 255  | ✅       | -       | Product name          |
| `price`          | Float    | -    | ✅       | -       | Current price         |
| `oldprice`       | Float    | -    | ❌       | -       | Original price        |
| `category`       | String   | 100  | ✅       | -       | Product category      |
| `imgSrc`         | String   | 500  | ✅       | -       | Main image URL        |
| `imgHover`       | String   | 500  | ❌       | -       | Hover image URL       |
| `thumbImages`    | String[] | -    | ❌       | -       | Thumbnail URLs        |
| `description`    | String   | 5000 | ❌       | -       | Product description   |
| `rating`         | Float    | -    | ❌       | 0       | Average rating (1-5)  |
| `inStock`        | Boolean  | -    | ❌       | true    | Availability status   |
| `isNew`          | Boolean  | -    | ❌       | false   | New product badge     |
| `isTodaysDeals`  | Boolean  | -    | ❌       | false   | Today's deals badge   |
| `hotSale`        | Boolean  | -    | ❌       | false   | Hot sale badge        |
| `salePercentage` | String   | 10   | ❌       | -       | Sale tag (e.g. "20%") |
| `filterBrands`   | String[] | -    | ❌       | -       | Brands for filtering  |
| `sold`           | Integer  | -    | ❌       | 0       | Items sold count      |
| `available`      | Integer  | -    | ❌       | 0       | Stock available       |

---

## 2. `blogs` Collection

**ID:** `blogs`

| Attribute     | Type     | Size  | Required | Default | Description           |
| ------------- | -------- | ----- | -------- | ------- | --------------------- |
| `title`       | String   | 255   | ✅       | -       | Blog title            |
| `content`     | String   | 50000 | ❌       | -       | HTML/Markdown content |
| `description` | String   | 500   | ❌       | -       | Short excerpt         |
| `imgSrc`      | String   | 500   | ✅       | -       | Featured image URL    |
| `tag`         | String   | 50    | ❌       | -       | Category tag          |
| `date`        | DateTime | -     | ❌       | -       | Publish date          |
| `author`      | String   | 100   | ❌       | -       | Author name           |

---

## 3. `collections` Collection

**ID:** `collections`

| Attribute     | Type    | Size | Required | Default | Description        |
| ------------- | ------- | ---- | -------- | ------- | ------------------ |
| `title`       | String  | 100  | ✅       | -       | Collection name    |
| `imgSrc`      | String  | 500  | ✅       | -       | Image URL          |
| `sale`        | String  | 10   | ❌       | -       | Sale text          |
| `productText` | String  | 100  | ❌       | -       | Promo text         |
| `darkText`    | Boolean | -    | ❌       | false   | Text color variant |

---

## 4. `testimonials` Collection

**ID:** `testimonials`

| Attribute      | Type     | Size | Required | Default | Description             |
| -------------- | -------- | ---- | -------- | ------- | ----------------------- |
| `name`         | String   | 100  | ✅       | -       | Customer name           |
| `imgSrc`       | String   | 500  | ❌       | -       | Customer avatar URL     |
| `text`         | String   | 2000 | ✅       | -       | Review content          |
| `rating`       | Integer  | -    | ✅       | 5       | Star rating (1-5)       |
| `date`         | DateTime | -    | ❌       | -       | Review date             |
| `verified`     | Boolean  | -    | ❌       | false   | Verified purchase badge |
| `productColor` | String   | 50   | ❌       | -       | Product variant         |

---

## 5. `user` Collection

**ID:** `user` _Note: Storing extra user profile data linked to Auth_

| Attribute    | Type   | Size | Required | Default | Description           |
| ------------ | ------ | ---- | -------- | ------- | --------------------- |
| `userId`     | String | 36   | ✅       | -       | Links to Auth User ID |
| `name`       | String | 100  | ❌       | -       | Display name          |
| `email`      | String | 255  | ✅       | -       | Email address         |
| `phone`      | String | 20   | ❌       | -       | Phone number          |
| `avatarUrl`  | String | 500  | ❌       | -       | Profile picture URL   |
| `address`    | String | 500  | ❌       | -       | Full address          |
| `city`       | String | 100  | ❌       | -       | City                  |
| `country`    | String | 100  | ❌       | -       | Country               |
| `postalCode` | String | 20   | ❌       | -       | Zip/Postal code       |

---

## 6. `orders` Collection

**ID:** `orders`

| Attribute         | Type   | Size  | Required | Default   | Description               |
| ----------------- | ------ | ----- | -------- | --------- | ------------------------- |
| `userId`          | String | 36    | ✅       | -         | Customer User ID          |
| `items`           | String | 10000 | ✅       | -         | JSON string of cart items |
| `totalAmount`     | Float  | -     | ✅       | -         | Total price               |
| `status`          | String | 50    | ✅       | "pending" | Order status              |
| `shippingAddress` | String | 500   | ✅       | -         | Shipping address          |
| `paymentMethod`   | String | 50    | ❌       | -         | Payment method            |
| `paymentStatus`   | String | 50    | ❌       | "pending" | Payment status            |
| `trackingNumber`  | String | 100   | ❌       | -         | Tracking code             |
| `notes`           | String | 1000  | ❌       | -         | Order notes               |

---

## 7. `wishlists` Collection

**ID:** `wishlists`

| Attribute   | Type   | Size | Required | Default | Description |
| ----------- | ------ | ---- | -------- | ------- | ----------- |
| `userId`    | String | 36   | ✅       | -       | User ID     |
| `productId` | String | 36   | ✅       | -       | Product ID  |

---

## 8. `carts` Collection

**ID:** `carts`

| Attribute   | Type    | Size | Required | Default | Description |
| ----------- | ------- | ---- | -------- | ------- | ----------- |
| `userId`    | String  | 36   | ✅       | -       | User ID     |
| `productId` | String  | 36   | ✅       | -       | Product ID  |
| `quantity`  | Integer | -    | ✅       | 1       | Qty         |

---

## 📦 Storage Configuration (Free Plan)

**Single Bucket Strategy:** All files (products, avatars, blogs) will be stored in one bucket to stay within free tier limits.

| Bucket ID | Name         | Allowed Extensions        | Max File Size |
| --------- | ------------ | ------------------------- | ------------- |
| `storage` | Main Storage | jpg, jpeg, png, webp, svg | 10MB          |

---

## 🔐 Permissions Guide

1. **Public Read, Admin Write** (`products`, `blogs`, `collections`, `testimonials`)
   - Role: `Any` -> Read
   - Role: `Team` (Admins) -> Create, Update, Delete

2. **User Private** (`wishlists`, `carts`, `orders`)
   - Role: `User` -> Create, Read, Update, Delete (Owner only)

3. **User Profile (`user`)**
   - Role: `User` -> Read, Update
