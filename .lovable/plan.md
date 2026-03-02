
# Mobile UI/UX Transformation — Premium Indian Wedding App

Redesign the entire mobile experience to match the reference mockups: warm cream backgrounds, maroon/rose primary, gold circular icons, large wedding countdown dial, refined bottom navigation, and polished vendor/tool screens.

---

## Phase 1: Color System and Typography Overhaul

**File: `src/index.css`**

- Change `--background` from pure white `0 0% 100%` to warm cream `35 30% 97%` (the beige tone from reference)
- Update `--card` to `35 25% 98%` for soft cream cards
- Adjust `--primary` to deeper maroon `340 65% 38%` (the dark rose/maroon in the mockups)
- Keep `--accent` as gold but boost saturation: `38 85% 52%`
- Update body background gradient to warm cream tones instead of white
- Add a new CSS variable `--cream` for consistent warm backgrounds
- Update `--border` to warmer tone `35 15% 88%`

---

## Phase 2: Bottom Navigation Redesign

**File: `src/components/mobile/BottomNavigation.tsx`**

Reference shows: Home, Vendors, Tools, Bookings, Profile (5 tabs, no FAB spacer for guests)

Changes:
- Update guest nav items to: Home, Vendors (`/search`), Tools (`/tools`), Bookings (`/bookings`), Profile (`/auth`)
- Update couple nav items to: Home, Vendors (`/search`), Tools (`/tools`), Bookings (`/bookings`), Profile (`/dashboard`)
- Remove the FAB spacer gap (reference has no floating button, clean 5-tab layout)
- Add filled/outlined icon variants: filled circle background for active tab (maroon bg with white icon)
- Increase nav height slightly to 60px with better spacing
- Active indicator: filled circular icon container instead of top bar line

**File: `src/components/mobile/QuickActionFAB.tsx`**
- Remove FAB from bottom nav (reference doesn't show it)
- Keep component but don't render in BottomNavigation

---

## Phase 3: Mobile Home Screen (Logged-in Users)

**File: `src/components/mobile/MobileHomeScreen.tsx`**

Complete redesign to match reference image 4 (hand holding phone):

1. **Top Bar**: Logo left, notification bell right (keep existing but style with cream bg)
2. **Wedding Countdown Circle**: Large circular countdown widget
   - Maroon/rose gradient circular ring with "Wedding in" text
   - Large "156 Days" number centered
   - "12:34:56" countdown timer below
   - CSS circular progress ring using SVG
3. **Planning Progress Bar**: "75% Planned" horizontal progress bar below countdown
4. **Quick Action Grid (2x3)**: 6 circular icon buttons in warm rose/cream tones
   - Budget, Checklist, Guests, Moodboard, Vendors, Website
   - Each with circular maroon/cream icon container + label below
5. **Total Budget Card**: Show budget summary (Total, Spent, Remaining) in Indian format
6. **Planning Tools Section** with "See All" link
7. **Wedding Checklist & Guest List** side-by-side cards preview

---

## Phase 4: Mobile Home Screen (Guest Users)

**File: `src/pages/Index.tsx`**

For mobile guests, show a compact home instead of full marketing page:

1. **Hero Banner**: Compact card with wedding image, "Your Dream Wedding" headline, "Calculate Services" CTA button
2. **Quick Tool Icons Row**: Horizontal scroll with circular icons (Budget Calculator, Muhurat Finder, Invite Venue, Photographer, Makeup Artist)
3. **Find Best Vendors Section**: Horizontal scrollable vendor cards with ratings
4. **Top Vendors Section**: Grid of vendor cards with "See All"
5. **Planning Tools Section**: Checklist and Guest List preview cards

---

## Phase 5: Dashboard Page Redesign

**File: `src/pages/Dashboard.tsx`**

Match reference image 4:
- Replace flat card layout with circular countdown widget at top
- Add circular progress ring SVG component
- Quick actions as 2x3 grid of circular icons (not cards)
- Budget summary card with Indian number formatting
- Mobile: remove excess cards, focus on countdown + actions + budget

---

## Phase 6: Tools Landing Page Polish

**File: `src/pages/ToolsLanding.tsx`**

Match reference image 3 (Tools Hub):
- 3x3 grid layout for mobile
- Each tool: icon in a cream/gold rounded square container + label below
- Remove gradient backgrounds from icons, use cream/maroon/gold flat circles instead
- Section title "Tools Hub" instead of "Wedding Tools"
- Remove emoji icons, use Lucide icons in maroon-tinted circular containers

---

## Phase 7: Vendor Profile Mobile Polish

**File: `src/pages/VendorProfile.tsx`**

Match reference image 2 (Royal Moments Photography):
- Full-width photo carousel at top with dot indicators
- Business name + verified badge below
- Star rating + review count
- "Services" section with horizontal scrollable service cards (icon + name + price)
- "Reviews Preview" section with avatar + name + stars + quote
- Calendar section for availability
- Sticky bottom CTA: "Book This Vendor" full-width maroon button

---

## Phase 8: Checkout/Booking Polish

**File: `src/pages/Checkout.tsx`**

Match reference image 2 (Booking Checkout):
- Clean white card with "Advance Payment (30%)" header
- Large amount display centered
- Milestone timeline with checkmarks (30% advance, 70% final)
- "Secure Payment" section with Razorpay branding
- Trust badges row: SSL Secured, 100% Fraud Protection, Verified Vendor, Karlo Shaadi Guarantee
- Full-width maroon CTA: "Confirm Booking & Pay amount"

---

## Phase 9: Vendor Dashboard (Dark Theme)

**File: `src/pages/VendorDashboard.tsx`**

Match reference image 6 (dark gold vendor dashboard):
- Mobile vendor dashboard uses dark background with gold accents
- Revenue chart card with dark bg + gold line chart
- Booking Statistics: 3-column (Confirmed/Pending/Completed) with colored dots
- Inquiry Inbox preview card
- Key metrics row: Rating, Response Time, Profile Views
- Gold Verified Partner badge at bottom
- Booking Management: clean list cards with colored status tags (Gold, Green, Completed)

---

## Phase 10: Categories & Search Page Polish

**File: `src/pages/Categories.tsx`**
- Horizontal scrollable category chips with icons at top
- 2-column vendor grid below with image, name, rating, price
- Each vendor card: rounded image, heart icon overlay, rating badge

**File: `src/pages/Search.tsx`**
- "Vendor Discovery" header
- Search bar + filter icon
- Horizontal category pills with maroon icons (Photography, Catering, Makeup, DJ)
- Vendor cards in list/grid view with image, rating, price range, "Book Now" button

---

## Phase 11: Shared UI Components

**New file: `src/components/mobile/CountdownCircle.tsx`**
- SVG-based circular countdown ring
- Props: daysLeft, hours, minutes, seconds
- Maroon gradient stroke, cream inner fill
- Large number display in center

**New file: `src/components/mobile/CircularIconButton.tsx`**
- Reusable circular icon button component
- Props: icon, label, onClick, variant (cream/maroon/gold)
- Used across home screen, dashboard, tools hub

---

## Phase 12: CSS Refinements

**File: `src/index.css`**
- Add `.btn-maroon` utility: full-width, maroon bg, white text, rounded-xl, h-12
- Add `.card-cream` utility: cream bg, subtle warm border, soft shadow
- Add `.icon-circle` utility: 48px circular container with gradient bg
- Update mobile-specific overrides for the new warm palette
- Ensure all mobile buttons use the maroon primary color consistently

---

## Implementation Order

| Batch | Scope | Files |
|-------|-------|-------|
| 1 | Color system + CSS variables | `index.css` |
| 2 | Bottom nav + remove FAB | `BottomNavigation.tsx`, `QuickActionFAB.tsx` |
| 3 | CountdownCircle + CircularIconButton components | New components |
| 4 | Mobile home screen (logged-in) | `MobileHomeScreen.tsx` |
| 5 | Guest home mobile view | `Index.tsx` |
| 6 | Dashboard redesign | `Dashboard.tsx` |
| 7 | Tools hub polish | `ToolsLanding.tsx` |
| 8 | Vendor profile + checkout polish | `VendorProfile.tsx`, `Checkout.tsx` |
| 9 | Vendor dashboard dark theme | `VendorDashboard.tsx` |
| 10 | Categories + Search polish | `Categories.tsx`, `Search.tsx` |

---

## Key Design Tokens from Reference

| Element | Value |
|---------|-------|
| Background | Warm cream #F7F3EE / hsl(35, 30%, 97%) |
| Primary (Maroon) | #8B1A4A / hsl(340, 65%, 33%) |
| Gold Accent | #C5943A / hsl(38, 55%, 50%) |
| Card Background | #FAF7F2 / hsl(35, 40%, 96%) |
| Icon Containers | 48px circles with maroon/cream gradient |
| Bottom Nav | 5 tabs, filled circle for active |
| Buttons | Full-width, rounded-xl, maroon fill |
| Typography | Serif for display headings, clean sans for body |

All changes maintain desktop compatibility while transforming the mobile experience to match the premium Indian wedding app aesthetic shown in the reference images.
