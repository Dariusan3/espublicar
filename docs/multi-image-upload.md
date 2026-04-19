# Multi-Image Upload

Upload up to 8 images per product listing with drag-and-drop support and image gallery on the product detail page.

## How It Works

1. **AddProduct form** (`components/dashboard/AddProduct.tsx`) allows selecting or dragging multiple image files
2. Images are uploaded sequentially to Appwrite storage via `uploadProductImage` from `lib/storage.js`
3. First image → `imgSrc` (main image), second → `imgHover`, all images → `thumbImages[]` array
4. Product detail page slider (`components/product-detail/sliders/Slider1.tsx`) renders all `thumbImages` as a Swiper gallery with thumbnails

## Files Modified

- `hooks/useStorage.ts` — Added `uploadMultipleProductImages` for batch uploads
- `components/dashboard/AddProduct.tsx` — Multi-file uploader with preview grid, drag-and-drop, progress bar
- `components/product-detail/sliders/Slider1.tsx` — Accepts `images` prop array; renders gallery from product's `thumbImages`
- `components/product-detail/Details1.tsx` — Passes `product.thumbImages` to Slider1

## Appwrite Schema

Uses existing `products` collection fields:
- `imgSrc` (String) — Main image URL
- `imgHover` (String) — Hover/second image URL
- `thumbImages` (String[]) — Array of all image URLs

## UI Features

- Thumbnail preview grid showing all selected images
- "Principal" badge on the first (main) image
- Individual remove buttons per image
- Upload progress bar with percentage
- External URL fallback when no files are selected
- Max 8 images, 5MB each (JPG, PNG, WebP)
