# Notifications System

In-app notification system with a bell icon in the header and a full notifications page in the dashboard.

## Appwrite Collection: `notifications`

| Attribute | Type | Description |
|-----------|------|-------------|
| `userId` | String | Recipient user ID |
| `type` | String | `message` / `order` / `offer` / `review` / `system` |
| `title` | String | Notification title text |
| `body` | String | Optional detail text |
| `referenceId` | String | Related entity ID (optional) |
| `referenceType` | String | `conversation` / `order` / `offer` / `product` (optional) |
| `isRead` | Boolean | Read status, default `false` |

## How It Works

1. `NotificationBell` component in the header shows unread count badge
2. Clicking the bell opens a dropdown with the 10 most recent notifications
3. Each notification links to its related page based on `referenceType`
4. "Marcar todo leído" marks all notifications as read
5. Full notifications page at `/my-account-notifications` shows all notifications

## Notification Types & Icons

| Type | Icon | Links to |
|------|------|----------|
| `message` | message-circle | `/my-account-messages?conversationId=X` |
| `order` | package | `/my-account-orders` |
| `offer` | tag | `/my-account-offers` |
| `review` | star | `/product/X` |
| `system` | bell | Notifications page |

## Files Created

- `hooks/useNotifications.ts` — `getMyNotifications`, `getUnreadCount`, `markAsRead`, `markAllAsRead`, `createNotification`
- `components/common/NotificationBell.tsx` — Header bell with dropdown, unread badge, click-outside-to-close
- `components/dashboard/NotificationsList.tsx` — Full page notifications list
- `app/(dashboard)/my-account-notifications/page.tsx` — Dashboard page

## Files Modified

- `types/Types.ts` — Added `Notification`, `NotificationDB` interfaces
- `helpers/dbHelpers.ts` — Added `toNotification`, `toNotifications` converters
- `lib/appwrite.js` — Added `NOTIFICATIONS_COLLECTION_ID` and `COLLECTIONS.NOTIFICATIONS`
- `components/headers/Header4.tsx` — Added `NotificationBell` next to user icons
- `components/dashboard/Sidebar.tsx` — Added "Notificaciones" menu item
- `hooks/index.ts` — Exports `useNotifications`

## Integration Points

The `createNotification` function can be called from other hooks:
- `useChat.sendMessage` → notify recipient of new message
- `useOffers.makeOffer` → notify seller of new offer
- `useOffers.respondToOffer` → notify buyer of response
- `useOrders.updateOrderStatus` → notify buyer of status change

## Polling

- Unread count polls every 30 seconds via `setInterval`
- Dropdown fetches fresh data on each open
