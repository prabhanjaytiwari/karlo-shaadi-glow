

# Global UI/UX Enhancement — WedMeGood-Level Polish

## What Needs Improvement

After reviewing the entire codebase, here are the key gaps compared to WedMeGood/Shaadi.com:

1. **Header** feels generic — no category image thumbnails in dropdowns, no sticky search bar, no "As Seen In" press badges
2. **Hero section** is decent but lacks a category quick-access strip below search (WedMeGood signature pattern)
3. **No "Browse by City" section** on homepage — critical for Indian wedding platforms
4. **Vendor cards** lack photo galleries, price tags, and booking CTA badges
5. **Section transitions** are plain gradient backgrounds — need more visual breaks with dividers
6. **Footer** is text-heavy without visual hierarchy or app download CTAs
7. **Trust signals** are not persistent enough — no floating "Verified Platform" badge
8. **Category pages** lack filter pills at the top (WedMeGood-style horizontal scroll filters)
9. **Reviews carousel** uses avatar placeholders instead of real wedding photos
10. **No "Real Wedding" photo mosaic section** — this is the #1 engagement driver on WedMeGood

## Implementation Plan (8 Changes)

### 1. Homepage — Add Category Strip Below Hero
Add a horizontally scrolling category icon strip (venue, photography, catering, etc.) with circular thumbnails immediately below the hero search — the WedMeGood signature pattern. This replaces the current jump from hero to TrustStats.

**File**: `src/pages/Index.tsx`

### 2. Homepage — Add "Popular Cities" Grid Section
Add a 2-row grid of top Indian wedding cities (Delhi, Mumbai, Jaipur, Udaipur, Goa, Bangalore, Lucknow, Hyderabad) with background images and vendor counts. Links to `/city/{slug}`. Place after the Tools section.

**File**: `src/pages/Index.tsx`

### 3. Homepage — Add "Real Weddings" Photo Mosaic
Replace the text-heavy "Success Stories" section with a WedMeGood-style photo mosaic grid showing 6 real wedding photos with couple names, city, and vendor count overlays. Links to `/stories`.

**File**: `src/pages/Index.tsx`

### 4. Header — Enhanced Category Dropdown with Thumbnails
Add small circular thumbnail images next to each category in the desktop dropdown menu (Photography shows a camera shot, Venues shows a palace, etc.). Add vendor count badges.

**File**: `src/components/BhindiHeader.tsx`

### 5. Vendor Card — Add Price Badge & Gallery Dots
Add a "Starting ₹XX,XXX" badge overlay on vendor card images and small gallery dot indicators. Add a "Book Now" micro-CTA on hover.

**File**: `src/components/VendorCard.tsx`

### 6. Footer — Add Visual Hierarchy & App CTA
Restructure footer with a prominent "Download App" section at the top, "As Featured In" press logos strip, and better column spacing. Add social proof counter.

**File**: `src/components/BhindiFooter.tsx`

### 7. Reviews Section — Real Wedding Photos
Replace dicebear avatar placeholders with actual wedding couple images from assets. Add city badges and vendor-type tags to each testimonial card.

**File**: `src/components/ReviewsSection.tsx`

### 8. Global — Section Dividers & Spacing Consistency
Add decorative mandala-inspired SVG dividers between major homepage sections. Standardize all section padding to `py-12 md:py-20` and add subtle background pattern variation.

**File**: `src/index.css`, `src/pages/Index.tsx`

## Technical Details

- No new dependencies needed — all changes use existing Tailwind classes, lucide-react icons, and local image assets
- No database changes required
- All changes are purely presentational/CSS — no backend modifications
- Mobile responsive by default using existing breakpoint patterns
- Category strip and city grid use horizontal scroll on mobile, grid on desktop
- Estimated files to edit: 6 files

