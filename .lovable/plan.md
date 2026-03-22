

# Mobile Responsiveness Audit & Fix — All Pages

## Current State

The app already has some mobile foundations:
- `overflow-x: hidden` on html/body in `index.css` ✅
- `MobileHomeScreen` renders on mobile for Index ✅
- Most pages use `container mx-auto px-4` ✅
- `useIsMobile()` hook used extensively ✅

However, there are systematic issues across ~40+ pages that need fixing.

## Issues Found & Fixes

### 1. OVERFLOW FIX — Root Layout Wrapper
`MobileLayout.tsx` wraps all content but lacks `overflow-x-hidden`. Add it to prevent any child from causing horizontal scroll.

**File:** `src/layouts/MobileLayout.tsx`
- Add `overflow-x-hidden` to the root div

### 2. CONTAINER FIX — Standardize Padding
Many pages use `px-4 sm:px-6` but miss `lg:px-10`. Some pages use `md:px-6` inconsistently. Need to audit and standardize all container elements.

**Pattern to enforce everywhere:**
```
container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px]
```

**Pages with missing/inconsistent padding (~20 files):**
- `ForVendors.tsx`, `WhyKarloShaadi.tsx`, `About.tsx`, `Testimonials.tsx`, `VendorSuccessStories.tsx`, `EarnWithUs.tsx`, `ComingSoon.tsx`, `DataExport.tsx`, `FamilyFrame.tsx`, `CoupleQuiz.tsx`, `StoryDetail.tsx`, `VendorGuide.tsx`, `Blog.tsx`, `BlogPost.tsx`, `Investors.tsx`, `JoinAsManager.tsx`, `Legal.tsx`, `Privacy.tsx`, `Shipping.tsx`, `CancellationRefunds.tsx`

### 3. GRID FIX — Responsive Grid Breakpoints
Several grids jump from `grid-cols-1` straight to `grid-cols-3` or `grid-cols-4` without a tablet `md:grid-cols-2` step.

**Key files to fix:**
- `Index.tsx` line 151: `grid md:grid-cols-3` → `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- `Index.tsx` line 243: `grid grid-cols-3` → `grid grid-cols-1 sm:grid-cols-3` (stats row, fine at 3 on small)
- `Search.tsx` line 503: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` ✅ (already fine)
- `VendorGuide.tsx` line 237: `grid-cols-2 md:grid-cols-4` → `grid-cols-2 md:grid-cols-4` (OK, 2-col mobile)
- `VendorGuide.tsx` line 356: `md:grid-cols-3` → `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- `WeddingPlanResult.tsx` line 239: `grid-cols-2 md:grid-cols-4` (OK)
- `StoryDetail.tsx` line 185: `grid-cols-2 md:grid-cols-3` (OK)
- `WhyKarloShaadi.tsx` vendor benefits grid — needs responsive fix
- `BentoGrid.tsx` — audit grid breakpoints
- `ForVendors.tsx` — category grid and feature grids
- `Testimonials.tsx`, `SuccessStories.tsx` — card grids
- `ToolsLanding.tsx` — `grid-cols-2 md:grid-cols-3` (OK)
- `Dashboard.tsx` line 231: `grid-cols-2 md:grid-cols-5 lg:grid-cols-10` — desktop only, mobile has separate layout (OK)
- `BhindiFooter.tsx` line 193: `grid-cols-2 md:grid-cols-3 lg:grid-cols-7` (OK)
- `VendorProfile.tsx` line 430: `grid-cols-3` stats row — keep, small items
- `Pricing.tsx`, `VendorPricing.tsx` — pricing card grids need `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`

### 4. IMAGE FIX — No Fixed Heights on Mobile
Most images use `object-cover` with `aspect-ratio` or percentage heights which is correct. Check for any fixed `h-[XXXpx]` on image containers.

**Pattern:** Ensure all `<img>` tags have `w-full` and use aspect ratios instead of fixed pixel heights. The `CinematicImage` component already handles this well.

### 5. NAVBAR FIX
`BhindiHeader.tsx` already has a hamburger menu (Sheet component) on mobile and hides nav links. This is working correctly. Verify no links overflow.

### 6. TEXT FIX — Scale Down Large Headings
Several pages use `text-5xl` or `text-6xl` without proper mobile scaling:

**Files needing text scale fixes:**
- `WeddingWebsite.tsx`: `text-4xl md:text-5xl lg:text-6xl` → add `text-2xl sm:text-3xl` base
- `DataExport.tsx`: `text-4xl sm:text-5xl` → `text-2xl sm:text-4xl md:text-5xl`
- `Testimonials.tsx`: already has mobile conditional ✅
- `ForVendors.tsx`: `text-3xl md:text-5xl lg:text-6xl` → `text-2xl sm:text-3xl md:text-5xl`
- `VendorSuccessStories.tsx`: `text-4xl sm:text-5xl md:text-6xl` → `text-2xl sm:text-3xl md:text-5xl`
- `PremiumUpgrade.tsx`: `text-4xl md:text-5xl` → `text-2xl md:text-4xl`
- `BlogPost.tsx`: `text-3xl sm:text-4xl md:text-5xl` → `text-2xl sm:text-3xl md:text-4xl`
- `EarnWithUs.tsx`: already `text-2xl sm:text-3xl md:text-5xl` ✅
- `CoupleQuiz.tsx`: `text-3xl sm:text-4xl md:text-5xl` → `text-2xl sm:text-3xl md:text-4xl`
- `FamilyFrame.tsx`: `text-3xl sm:text-4xl md:text-5xl` → OK
- Multiple CTA sections with `text-3xl sm:text-4xl md:text-5xl` → standardize to `text-2xl sm:text-3xl md:text-4xl`

### 7. CARD FIX — Horizontal Cards Stack on Mobile
Key instances:
- `About.tsx` line 67: `grid md:grid-cols-[280px_1fr]` — already stacks on mobile ✅
- `WhyKarloShaadi.tsx` line 178: `flex-col md:flex-row` — already correct ✅
- `Index.tsx` sections: `lg:grid-cols-2` — already stacks ✅
- `StoryDetail.tsx` line 159: `lg:grid-cols-3` — stacks on mobile ✅
- `Messages.tsx` line 299: `md:grid-cols-3` — has mobile conditional ✅

Most horizontal layouts already use `flex-col md:flex-row` or `grid lg:grid-cols-2`. A few need attention.

## Implementation Plan

### Batch 1: Global Fixes (3 files)
1. `src/layouts/MobileLayout.tsx` — Add `overflow-x-hidden`
2. `src/index.css` — Add a `.page-section` utility for consistent container + padding
3. `src/components/ui/card.tsx` — Ensure base card has `overflow-hidden`

### Batch 2: High-Traffic Pages (8 files)
4. `src/pages/Index.tsx` — Grid fixes, text scaling
5. `src/pages/ForVendors.tsx` — Text scaling, grid fixes, container padding
6. `src/pages/VendorPricing.tsx` — Pricing grid 1→2→4 col
7. `src/pages/Pricing.tsx` — Same pricing grid fix
8. `src/pages/Dashboard.tsx` — Container padding standardization
9. `src/pages/Testimonials.tsx` — Grid and text fixes
10. `src/pages/VendorSuccessStories.tsx` — Text scaling
11. `src/pages/WhyKarloShaadi.tsx` — Vendor benefits grid fix

### Batch 3: Content & Tool Pages (10 files)
12-21: `DataExport`, `FamilyFrame`, `CoupleQuiz`, `BlogPost`, `PremiumUpgrade`, `VendorGuide`, `WeddingWebsite`, `About`, `Blog`, `StoryDetail`

### Batch 4: Remaining Pages (10 files)
22-31: `EarnWithUs`, `ComingSoon`, `Investors`, `JoinAsManager`, `Legal`, `Privacy`, `Shipping`, `CancellationRefunds`, `SuccessStories`, `Achievements`

### Batch 5: Component Fixes (5 files)
32-36: `BentoGrid`, `ReviewsSection`, `TensionsSection`, `LiveActivityFeed`, `SponsoredVendorsCarousel`

**Total: ~36 files, design-only changes (no content/feature changes)**

