

# Complete Platform UI/UX Transformation

## Scope

The platform has 80+ pages. The mobile home screen now looks premium and polished, but the rest of the site -- Auth, Dashboard, Search, Categories, Deals, Pricing, About, ForVendors, Bookings, Favorites, Profile, FAQ, ShaadiSeva, and more -- still uses the old aesthetic (generic gradients, inconsistent spacing, flat cards, no imagery).

This plan transforms the **15 highest-traffic pages** to match the home screen's design language: tight spacing, generated imagery, interactive cards, and a cohesive premium wedding feel.

---

## Design Language to Replicate

From `MobileHomeScreen.tsx`, the established patterns are:
- Near full-bleed hero banners with gradient overlays on real images
- Compact trust stat grids
- Horizontal scroll cards with generated images
- Gold accent ring borders on icons
- `space-y-5` tight section spacing
- Gradient-background interactive cards
- Sheet-based slide-out menus
- Mobile-first compact typography (H1: text-2xl, body: text-sm)

---

## Phase 1: Core User Journey Pages (Priority)

### 1. Auth Page (`src/pages/Auth.tsx`)
- Add a cinematic half-screen hero image (generated: couple at mandap entrance, warm tones)
- Split layout on desktop: image left, form right
- Mobile: image banner on top (h-40), form below
- Gold accent divider and brand tagline above form
- Rounded-2xl card with subtle ring-1 ring-accent/20

### 2. Dashboard Page (`src/pages/Dashboard.tsx`)
- Replace flat gradient bg with clean white background
- Quick actions: horizontal scroll strip with generated icon images (h-16 cards)
- Wedding countdown: immersive banner card with generated celebration image
- Tighter spacing throughout (space-y-4 on mobile)
- Profile completion: compact progress bar instead of badge list

### 3. Search Page (`src/pages/Search.tsx`)
- Mobile: sticky search bar with category chips as horizontal scroll
- Generated category header images when a category is selected
- Vendor cards: add portfolio thumbnail (first image or gradient placeholder)
- Compact card layout with image left, info right on mobile

### 4. Categories Page (`src/pages/Categories.tsx`)
- Generate a hero banner image (wedding collage mosaic)
- Category grid: use existing category images with overlay text
- Mobile: 2-column grid with tighter gap-3
- Add MobilePageHeader for mobile consistency

### 5. Bookings Page (`src/pages/Bookings.tsx`)  
- Already mobile-optimized but needs visual polish
- Add subtle card backgrounds with vendor category-colored left borders
- Empty state: generate a "no bookings" illustration

### 6. Favorites Page (`src/pages/Favorites.tsx`)
- Add MobilePageHeader
- Mobile: single column cards with vendor image thumbnails
- Generate an empty state illustration (couple browsing vendors)

---

## Phase 2: Marketing & Conversion Pages

### 7. Pricing Page (`src/pages/Pricing.tsx`)
- Generate a premium hero image (couple enjoying wedding stress-free)
- Cards: glassmorphism effect with gold border for premium plan
- Mobile: stack cards vertically, add "Most Popular" ribbon
- FAQ: use Accordion component for collapsibility

### 8. Deals Page (`src/pages/Deals.tsx`)
- Generate 3 seasonal deal banner images (monsoon wedding, winter wedding, early bird)
- Hero section: immersive banner with deals tagline
- Deal cards: image thumbnails with price strike-through styling
- Mobile: horizontal scroll for seasonal offers

### 9. ForVendors Page (`src/pages/ForVendors.tsx`)
- Generate a vendor success hero image (vendor team celebrating)
- Stats section: animated counters with gold icon backgrounds
- Mobile: compact single-column layout
- Add MobilePageHeader

### 10. About Page (`src/pages/About.tsx`)
- Generate founder/team section image
- Values grid: use generated symbolic images (heart for love, shield for trust)
- Stats section: gradient background with larger typography
- Mobile: single column with tight spacing

---

## Phase 3: Tool & Utility Pages

### 11. Profile Page (`src/pages/Profile.tsx`)
- Cleaner form layout with section dividers
- Add avatar placeholder with initials
- Mobile: full-width inputs with consistent padding

### 12. FAQ Page (`src/pages/FAQ.tsx`)
- Generate a support-themed hero image
- Category icons with colored backgrounds
- Collapsible accordion with smooth animations

### 13. ShaadiSeva Page (`src/pages/ShaadiSeva.tsx`)
- Generate an emotional hero image (community wedding celebration)
- Impact counter with animated numbers
- Application form with clean card layout

### 14. Checklist Page (`src/pages/Checklist.tsx`)
- Add progress visualization
- Category-grouped tasks with icons

### 15. VendorProfile Page (`src/pages/VendorProfile.tsx`)
- Gallery section polish
- Contact card with generated map placeholder

---

## Image Generation Plan

Generate **12 images** using Nano Banana Pro (`google/gemini-3-pro-image-preview`):

| # | Image | Usage |
|---|-------|-------|
| 1 | Couple at mandap entrance, cinematic warm light | Auth page hero |
| 2 | Wedding celebration collage/mosaic | Categories page hero |
| 3 | Couple enjoying wedding carefree | Pricing page hero |
| 4 | Monsoon wedding with umbrellas | Deals - seasonal banner |
| 5 | Winter wedding with fairy lights | Deals - seasonal banner |
| 6 | Early morning wedding ceremony | Deals - seasonal banner |
| 7 | Vendor team group celebration | ForVendors hero |
| 8 | Community mass wedding (Saamuhik Vivaah) | ShaadiSeva hero |
| 9 | Couple browsing on phone | Favorites empty state |
| 10 | Wedding planning desk flatlay | Dashboard countdown bg |
| 11 | Support/help desk friendly | FAQ hero |
| 12 | Founder portrait style (professional) | About page |

---

## Technical Approach

### Consistent Patterns
- All pages get `MobilePageHeader` on mobile
- Background: `bg-background` (no more rose-50/amber-50 gradients everywhere)
- Section spacing: `py-12 md:py-20` (compressed from py-16 md:py-24)
- Cards: `rounded-2xl border border-border/50` with hover states
- Generated images stored in `src/assets/` as JPGs
- Hero sections: image with gradient overlay, not plain gradient backgrounds

### Wiring Check
- All navigation links verified between pages
- Bottom navigation covers: Home, Search, Bookings, Favorites, Dashboard
- Header menu links to: Categories, Deals, Pricing, Tools, Shaadi Seva
- Auth redirects properly to Dashboard (couples) and Vendor Dashboard (vendors)

### Mobile-First
- Every page uses `useIsMobile()` for responsive branching
- Touch targets minimum 44px
- Horizontal scrolls for lists that overflow on mobile
- No desktop-only sections hidden on mobile (content parity)

---

## Implementation Order

1. Generate all 12 images first (batch edge function calls)
2. Auth page transformation (highest conversion impact)
3. Dashboard page polish
4. Search + Categories pages
5. Deals + Pricing pages
6. ForVendors + About pages
7. Remaining utility pages (Profile, FAQ, ShaadiSeva, Favorites, Bookings)
8. Final wiring and navigation audit

This will be implemented across multiple messages due to the volume of changes. Each message will tackle 2-3 pages with their associated generated images.

