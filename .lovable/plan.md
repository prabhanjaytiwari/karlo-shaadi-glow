

# Apple-Level Design Overhaul — All Remaining Pages & Components

## Scope

The previous overhaul covered ~12 files (Index, MobileHomeScreen, VendorPricing, card/button base, TrustStatsBanner, TensionsSection, ReviewsSection, VendorCard, BentoGrid, LiveActivityFeed, SponsoredVendorsCarousel, index.css). This plan covers **every remaining page and component** to achieve a consistent Apple-like design system across the entire platform.

## Design Philosophy (Applied Uniformly)

- Pure white backgrounds, no gradient washes
- Shadow-based depth (`shadow-sm` → `shadow-md` on hover), no heavy borders
- Generous whitespace with compact information density
- Clean typography hierarchy with tight letter-spacing
- Rounded-2xl cards, subtle transitions (translateY -1px on hover)
- No decorative blurs, bokeh, shimmer, or sparkle elements
- Glassmorphism only for overlays on images (headers on hero images)

## Files to Modify (~30 files, grouped by priority)

### Group 1: Core Experience Pages

**`src/pages/Auth.tsx`** — Clean the auth card: remove `ring-1 ring-primary/10`, simplify vendor CTA section gradient, remove decorative divider line (`w-12 h-0.5 bg-gradient-to-r`). Desktop hero stats ("50K+", "2L+") need to match real data or be removed. Simplify the referral banner gradient.

**`src/pages/Dashboard.tsx`** — Replace `border border-border` on all cards with shadow-based styling. Remove emoji icons from quick actions — use clean icon circles instead. Simplify the "More Tools" button. Clean up the profile completion progress bar gradient.

**`src/pages/Search.tsx`** — Remove `bg-gradient-to-br from-primary/5 to-accent/5` on sponsored cards. Clean category chips: remove `border-border/40`, use shadow-based selected state. Remove gradient divider (`h-px bg-gradient-to-r`). Simplify mobile search header with cleaner bg. Remove `AVATAR_GRADIENTS` — use consistent neutral avatar fallbacks.

**`src/pages/VendorProfile.tsx`** — Already has WhatsApp-first CTA. Clean up any remaining gradient badges, border-heavy containers.

**`src/pages/Messages.tsx`** — Clean chat interface: shadow-based conversation list, cleaner message bubbles, remove heavy borders.

### Group 2: Planning & Tools Pages

**`src/pages/ToolsLanding.tsx`** — Remove the gradient background (`linear-gradient(165deg, ...)`). Use `bg-background`. Simplify tool cards: remove `bg-white/60 backdrop-blur-sm border border-white/80`, use clean `bg-card shadow-sm rounded-2xl` pattern. Remove `whileHover={{ scale: 1.1 }}` on emoji containers.

**`src/pages/Checklist.tsx`** (659 lines) — Clean up accordion items, progress bars, dialog styling. Consistent shadow-based cards.

**`src/pages/GuestList.tsx`** (626 lines) — Clean table styling, dialog forms, tab navigation.

**`src/pages/BudgetCalculatorPage.tsx`** + **`src/components/BudgetCalculator.tsx`** — Audit the calculator component for gradient washes, heavy borders.

**`src/pages/MuhuratFinderPage.tsx`** + **`src/components/MuhuratFinder.tsx`** — Clean muhurat cards (already partially addressed in CSS).

### Group 3: Content & Marketing Pages

**`src/pages/ForVendors.tsx`** — Already clean from Phase 2. Minor touch-ups: ensure `accent/5` backgrounds are subtle enough, verify no `border-accent/20` remains.

**`src/pages/WhyKarloShaadi.tsx`** (332 lines) — Remove gradient overlays from role cards (`from-rose-500/20 to-pink-500/20`). Clean feature list cards. Simplify hero section.

**`src/pages/About.tsx`** — Remove gradient text (`bg-gradient-to-r from-primary via-pink-500 to-accent bg-clip-text`). Use solid primary color for brand name. Clean stat cards.

**`src/pages/FAQ.tsx`**, **`src/pages/HelpCenter.tsx`**, **`src/pages/Support.tsx`** — Clean accordion/card styling.

**`src/pages/Blog.tsx`**, **`src/pages/BlogPost.tsx`** — Clean article cards and layout.

**`src/pages/Stories.tsx`**, **`src/pages/StoryDetail.tsx`** — Clean story cards.

### Group 4: User Account Pages

**`src/pages/Profile.tsx`** — Clean form layout, remove any gradient washes.

**`src/pages/Settings.tsx`** — Clean tab navigation, card containers.

**`src/pages/Favorites.tsx`** — Shadow-based favorite cards, clean compare mode UI.

**`src/pages/Bookings.tsx`** — Clean booking cards, status badges, filter chips.

**`src/pages/Notifications.tsx`** — Clean notification list items.

### Group 5: Vendor-Side Pages

**`src/pages/VendorDashboard.tsx`** — Further polish: ensure all tab content uses shadow-based cards consistently.

**`src/pages/VendorOnboarding.tsx`** — Clean step indicators, form styling.

**`src/pages/VendorAuth.tsx`** — Match couple Auth.tsx cleanliness.

**`src/pages/VendorSettings.tsx`**, **`src/pages/VendorBilling.tsx`** — Clean card containers.

### Group 6: Shared Components

**`src/components/BhindiHeader.tsx`** — Already functional. Ensure nav dropdown uses `shadow-xl` not border-heavy styling.

**`src/components/BhindiFooter.tsx`** — Clean footer: remove any gradient backgrounds, ensure minimal border usage.

**`src/components/mobile/MobilePageHeader.tsx`** — Ensure clean white bg with subtle bottom border.

**`src/components/mobile/BottomNavigation.tsx`** — Clean bottom nav: subtle top shadow instead of border.

**`src/components/EmptyState.tsx`** — Clean illustration area.

**`src/components/GlassCard.tsx`** — Simplify glass effect to match new system.

**`src/components/BookingDialog.tsx`**, **`src/components/QuickInquiryDialog.tsx`** — Clean dialog styling.

### Group 7: AI-Generated Images for Visual Sections

Generate high-quality thematic illustrations using Nano Banana Pro for key sections that currently lack visual appeal:
- Tools landing page header illustration (wedding planning toolkit concept)
- Empty states (no bookings, no favorites, no messages)
- Dashboard welcome card backgrounds

These will be generated via the existing `generate-home-banners` edge function pattern and stored in Supabase storage.

## Technical Approach

### Consistent Pattern Applied to Every File
```text
BEFORE:                              AFTER:
─────────                            ─────
border border-border/50       →      shadow-[var(--shadow-sm)]
border-2 border-accent/20    →      shadow-sm (removed border)
bg-gradient-to-b from-...    →      bg-background or bg-muted/30
ring-1 ring-primary/10       →      (removed)
backdrop-blur-xl              →      (removed unless on image overlay)
bg-white/60 backdrop-blur    →      bg-card shadow-sm
```

### Implementation Order
1. Group 6 (shared components) — cascading improvements
2. Group 1 (core experience) — highest traffic
3. Group 2 (tools) — high engagement
4. Group 4 (account) — user retention
5. Group 3 (marketing) — conversion pages
6. Group 5 (vendor) — vendor experience
7. Group 7 (AI images) — visual polish

### Estimated Scope
- ~30 files modified
- No content, feature, or routing changes
- No database changes
- AI image generation for 3-5 key visual assets

