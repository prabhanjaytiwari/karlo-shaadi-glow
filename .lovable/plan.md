

# Apple-Like Design System Overhaul

## Design Direction (from reference images)

The references show a consistent design language:
- **Ultra-clean whitespace** with generous padding
- **Subtle shadows** instead of borders (no heavy border-2, border-accent/20 patterns)
- **Soft, rounded cards** with barely-visible borders and smooth shadows
- **Minimal gradients** — solid white/gray backgrounds, not rose-50/amber-50 washes
- **Clean typography hierarchy** — large bold headings, small muted descriptions
- **Compact, information-dense** but with breathing room
- **No floating bokeh elements**, no decorative blurs, no shimmer animations
- **Pill badges** are subtle, not loud

## What Changes (Design Only — No Content/Feature Changes)

### 1. Global CSS Overhaul (`src/index.css`)

**Remove:**
- Body fixed background gradient (rose/amber wash) → pure white
- Floating animation classes (float-slow, float-medium, float-fast)
- Heavy glass effects → simpler, cleaner card styles
- Overly decorative section backgrounds

**Update:**
- Shadow system to Apple-style subtle shadows: `0 1px 3px rgba(0,0,0,0.08)` base, `0 4px 16px rgba(0,0,0,0.06)` elevated
- Border colors to nearly invisible: `rgba(0,0,0,0.04)`
- Card backgrounds to pure white
- Reduce `--radius` from 0.5rem to 0.75rem (rounder, Apple-like)

### 2. Desktop Homepage (`src/pages/Index.tsx`)

**Hero:** Keep image, remove floating bokeh circles and shimmer effects. Clean up the stacked animation classes. Simplify CTA area — single primary button + text link instead of two gradient buttons.

**Trust Stats:** Remove gradient background. Clean 4-column stat grid with minimal styling — just icon + number + label on white.

**Tensions Section:** Remove floating category icons. Keep text content but strip the decorative blur backgrounds and gradient washes. Simple centered section on white.

**Free Tools Section:** Remove `bg-gradient-to-b from-white via-rose-50/30`. Cards: white background, subtle shadow on hover, no border-2 border-accent/20. Remove icon box gradients — use simple light gray circle.

**Value Proposition:** Remove gradient background. Clean card with subtle shadow.

**How It Works:** Remove gradient wash. Clean numbered steps with thin separator lines.

**Shaadi Seva:** Remove gradient wash. Simple centered section.

**CTA Sections:** Remove gradient overlays. Clean white sections with single accent-color button.

### 3. Mobile Home (`src/components/mobile/MobileHomeScreen.tsx`)

**Header:** Keep structure but clean — pure white bg, no backdrop-blur-xl (unnecessary on solid white). Thinner border.

**Hero Banner:** Keep image but simplify overlay — single gradient, remove ring-1 ring-accent/20. Clean rounded-2xl with shadow only.

**Trust Stats:** Remove bg-card and border from each stat pill. Simple flex row with just text, no card wrapper per stat.

**Category Strip:** Keep circular thumbnails but remove ring-2 ring-accent/30. Simple subtle shadow.

**Vendor Cards:** White card, subtle shadow, no border-border/40. Clean image + text.

**Tool Cards:** Same approach — white, shadow, no borders. Consistent 12px border-radius.

**Deal Cards:** Keep gradient but soften — less saturated, more Apple-like.

**All sections:** Remove divider gradients between sections. Use spacing instead.

### 4. Vendor Pricing Page (`src/pages/VendorPricing.tsx`)

Redesign to match reference images (Gamma/Resolve pricing style):
- Remove gradient background
- Clean white cards with subtle shadows
- "Most Popular" card gets a dark/primary background (inverted) like reference
- Remove loss aversion warnings (AlertTriangle, destructive text)
- Remove "spots left" badges and pulse animations
- Remove social proof banner with fake "847 vendors upgraded" claim
- Clean feature lists with simple checkmarks
- FAQ as clean accordion, not stacked cards
- Remove countdown banners and mid-page urgency

### 5. Component Touch-ups

**Cards everywhere:** `border border-border/50` → `shadow-sm` only. Remove `border-2 border-accent/20` pattern globally.

**Buttons:** Keep rounded-full but remove shimmer/glow animations. Clean solid fills.

**Section backgrounds:** All `bg-gradient-to-b from-white via-rose-50/30 to-white` → simple `bg-white` or very subtle `bg-gray-50/50`.

**Badge pills:** Reduce visual weight — smaller, no gradients on badges.

### 6. Supporting Components

- `src/components/TrustStatsBanner.tsx` — Simplify to clean minimal stats row
- `src/components/TensionsSection.tsx` — Remove floating icons, blur backgrounds
- `src/components/ReviewsSection.tsx` — Clean cards, remove Quote icon decorations
- `src/components/BentoGrid.tsx` — Simplify card styling
- `src/components/LiveActivityFeed.tsx` — Clean minimal styling
- `src/components/SponsoredVendorsCarousel.tsx` — Simpler card layout

## Technical Approach

### Files to Edit (~12 files)
1. `src/index.css` — Global design tokens, shadow system, remove decorative classes
2. `src/pages/Index.tsx` — Desktop homepage sections cleanup
3. `src/components/mobile/MobileHomeScreen.tsx` — Mobile homepage cleanup
4. `src/pages/VendorPricing.tsx` — Complete visual redesign matching references
5. `src/components/TrustStatsBanner.tsx` — Minimal stats
6. `src/components/TensionsSection.tsx` — Clean section
7. `src/components/ReviewsSection.tsx` — Clean review cards
8. `src/components/VendorCard.tsx` — Subtle shadow-based cards
9. `src/components/BentoGrid.tsx` — Clean grid styling
10. `src/components/ui/card.tsx` — Update base card to Apple-like shadow
11. `src/components/ui/button.tsx` — Remove shimmer/glow variants
12. `src/components/SponsoredVendorsCarousel.tsx` — Clean styling

### Design Tokens (CSS Variables)
```css
/* Apple-like shadows */
--shadow-xs: 0 1px 2px rgba(0,0,0,0.04);
--shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
--shadow-md: 0 4px 12px rgba(0,0,0,0.06);
--shadow-lg: 0 8px 24px rgba(0,0,0,0.08);

/* Cleaner borders */
--border: 0 0% 92%;

/* Pure white cards */
--card: 0 0% 100%;
```

### Preserved
- All content, text, images, routes, features
- Brand colors (primary magenta, gold accent)
- All functionality and interactions
- Mobile-first responsive behavior
- Light mode only policy

