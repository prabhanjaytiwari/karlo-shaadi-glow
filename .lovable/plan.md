

# Complete Mobile Home Screen Redesign

## What We're Building

A visually rich, app-store-quality mobile home screen that matches your reference image -- with a hero banner, circular category icons, vendor photo grids, inline planning tools (checklist/guest list), and a polished bottom navigation. This replaces the current minimal MobileHomeScreen for **both** logged-in and guest users.

---

## Reference Breakdown (From Your Image)

The reference shows these sections top-to-bottom:

1. **Logo Header** -- "KARLO SHAADI" branding at top
2. **Hero Banner** -- Full-width card with wedding couple photo, headline ("Your Dream Wedding" / "Aap Shaadi Karo..."), and a CTA button ("Calculate Services")
3. **Category Icon Row** -- Horizontal scroll of circular icons with labels (Budget Calculator, Muhurat Finder, Photographer, Makeup Artist, Invite Venue)
4. **Find Best Vendors** -- Horizontal scroll of vendor cards with photos, names, star ratings
5. **Top Vendors Grid** -- 2x2 photo grid of featured vendor images with a "See All" link
6. **Planning Tools** -- Side-by-side cards for "Wedding Checklist" and "Guest List" showing actual items with checkboxes
7. **Golden FAB** -- A gold/amber floating action button
8. **Bottom Nav** -- 5 tabs: Home, Vendors, Tools, Bookings, Profile

---

## Implementation Plan

### 1. Rewrite `MobileHomeScreen.tsx` (Complete Overhaul)

The entire component will be rebuilt with these sections:

**1a. Logo Header Bar**
- Sticky top bar with the Karlo Shaadi logo (already exists) + notification bell
- Slim, 48px height, backdrop blur

**1b. Hero Banner Card**
- Full-width rounded card with the `hero-wedding-phere.jpeg` image as background
- Gradient overlay (dark to transparent from bottom)
- Bold headline: "Your Dream Wedding" (guest) / "Aap Shaadi Karo, Tension Hum Sambhal Lenge" (logged-in with wedding countdown)
- Rose-colored CTA button: "Calculate Services" linking to `/budget-calculator`
- Dot indicators at the bottom (decorative, matching reference)

**1c. Category Quick Access Row**
- Horizontal scrollable row of 5 circular icons
- Each icon uses existing category images from `src/assets/icon-*.jpg` (venue, photography, decoration, mehendi, catering, etc.)
- Circular image thumbnails (not just lucide icons) with labels below
- Items: Budget Calculator, Muhurat Finder, Photographer, Makeup Artist, Invite Creator

**1d. Find Best Vendors Section**
- Section header: "Find Best Vendors" + "See All" link (routes to `/search`)
- Horizontal scroll of vendor cards fetched from the database
- Each card: rounded image, vendor name, star rating with review count
- Fallback: if no vendors in DB, show placeholder cards with existing wedding images

**1e. Top Vendors Photo Grid**
- Section header: "Top Vendors" + "See All" link
- 2x2 grid of large, rounded vendor/wedding photos using existing assets (`wedding-couple-1.jpg`, `wedding-ceremony.jpg`, `wedding-decoration.jpg`, `wedding-haldi.jpg`)
- Tappable, routes to `/search`

**1f. Planning Tools Section**
- Section header: "Planning Tools" + "See All" link
- Two side-by-side cards:
  - **Wedding Checklist**: Shows 3 checklist items with checkboxes (static display, taps navigate to `/checklist`)
  - **Guest List**: Shows 3 guest items with checkboxes (static display, taps navigate to `/guest-list`)
- Cards have a subtle border and rounded corners

**1g. Wedding Countdown (logged-in only)**
- If user has a wedding date set, show a slim countdown strip between hero and categories
- Gold/amber accent: "X days to your wedding"

### 2. Update Bottom Navigation Tabs

Change the **guest** nav items to match the reference:
- Home, **Vendors** (instead of Search), **Tools** (center), **Bookings**, **Profile/Login**

Change the **couple** nav items similarly:
- Home, **Vendors**, Tools (FAB), **Bookings**, **Profile**

### 3. Update `Index.tsx` Conditional

Currently only logged-in mobile users see MobileHomeScreen. Change this so **all mobile users** (guest and logged-in) see the new MobileHomeScreen. The full marketing page remains desktop-only.

### 4. Golden FAB Styling

Update `QuickActionFAB.tsx`:
- Change the FAB button color from `bg-primary` (rose) to a gold/amber gradient (`bg-gradient-to-br from-amber-400 to-amber-600`) to match the reference image's golden star button
- Add a subtle gold glow/shadow

---

## Files to Change

| File | Action |
|------|--------|
| `src/components/mobile/MobileHomeScreen.tsx` | **Rewrite** -- Complete redesign with all 7 sections above |
| `src/pages/Index.tsx` | **Edit** -- Show MobileHomeScreen for all mobile users (remove `user` condition) |
| `src/components/mobile/BottomNavigation.tsx` | **Edit** -- Update tab labels (Search -> Vendors, adjust guest tabs) |
| `src/components/mobile/QuickActionFAB.tsx` | **Edit** -- Gold gradient styling |

## Assets Used (Already in Project)

- `src/assets/hero-wedding-phere.jpeg` -- Hero banner background
- `src/assets/icon-venue.jpg`, `icon-photography.jpg`, `icon-decoration.jpg`, `icon-mehendi.jpg`, `icon-catering.jpg` -- Category circles
- `src/assets/wedding-couple-1.jpg`, `wedding-ceremony.jpg`, `wedding-decoration.jpg`, `wedding-haldi.jpg` -- Top vendors grid
- `src/assets/logo-new.png` -- Header logo
- `src/assets/category-photography.jpg`, `category-makeup.jpg` -- Additional category images

## No Backend Changes

This is a purely frontend UI transformation. Vendor data is fetched from the existing `vendors` table (same query pattern as `SponsoredVendorsCarousel`). No new tables, migrations, or edge functions needed.

