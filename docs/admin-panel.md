# Admin Panel

Full admin dashboard with real stats, product management, order management, and user management.

## Routes

| Route | Purpose |
|-------|---------|
| `/admin` | Dashboard with real-time stats and quick actions |
| `/admin/products` | Product listing table with search, delete |
| `/admin/orders` | All orders with status update dropdown |
| `/admin/customers` | User management table |

## How It Works

1. Admin layout (`app/admin/layout.tsx`) wraps all admin pages with sidebar navigation
2. `useAdmin` hook provides all admin CRUD operations
3. Dashboard shows live stats: total products, users, orders, revenue
4. Products page: search, view, delete products; link to seller profiles
5. Orders page: view all orders, change status via dropdown (pending → processing → shipped → delivered / cancelled)
6. Customers page: view all registered users, link to seller profiles

## Files Created

- `hooks/useAdmin.ts` — `getAllProducts`, `updateProduct`, `deleteProduct`, `getAllUsers`, `getAllOrders`, `updateOrderStatus`, `getAdminStats`
- `app/admin/products/page.tsx` — Product management with search, pagination, delete
- `app/admin/orders/page.tsx` — Order management with status update
- `app/admin/customers/page.tsx` — User listing with pagination

## Files Modified

- `app/admin/page.tsx` — Replaced mock stats with real data from `useAdmin().getAdminStats()`
- `hooks/index.ts` — Exports `useAdmin`

## Admin Stats

The dashboard fetches real aggregate data:
- **Total Products**: From `products` collection `.total`
- **Total Users**: From `user` collection `.total`
- **Total Orders**: From `orders` collection `.total`
- **Total Revenue**: Sum of `totalAmount` across all orders

## Order Status Flow

```
pending → processing → shipped → delivered
                                → cancelled
```

Admins can change status at any point via the dropdown in the orders table.

## Pagination

All admin tables use offset-based pagination with 20-25 items per page.
