

# Master Plan: Transform Karlo Shaadi into a Mobile-First App

## What This Plan Does

This plan converts your current website into a true mobile-app experience -- the kind that feels like Instagram, Zomato, or Swiggy when opened on a phone. Every page will be rethought for thumb-friendly navigation, fast loading, and native-feeling interactions.

---

## Current State (What Already Exists)

Your project already has some mobile foundations:
- A **bottom navigation bar** (Home, Search, Bookings, Messages, Profile) -- but only shows for logged-in users
- **Capacitor** configured for native iOS/Android builds
- A **PWA setup** with service worker and offline support
- A **mobile hamburger menu** in the header
- Safe area handling for notched phones

**What's Missing:**
- Most pages are still desktop-first with tiny text, desktop grids, and wasted space on mobile
- The homepage is a long marketing page -- not an app home screen
- No mobile-optimized Dashboard (the couple dashboard has desktop-only button rows)
- Footer renders on every page (apps don't have footers)
- Header still shows on mobile even with bottom nav (double navigation)
- Pages like Search, Bookings, Messages use `BhindiHeader` and `BhindiFooter` redundantly
- No pull-to-refresh, no swipe gestures, no app-like page transitions

---

## The Transformation (Phase by Phase)

### Phase 1: Mobile Shell and Navigation Overhaul

**Goal:** Make the app skeleton feel native on mobile.

**1.1 Hide Header + Footer on Mobile (for logged-in users)**
- Edit `src/App.tsx`: Wrap `BhindiHeader` in a condition that hides it on mobile when bottom nav is visible
- Edit `src/components/BhindiFooter.tsx`: Hide footer entirely on mobile screens (apps don't scroll to footers)
- The bottom navigation already exists and handles Home/Search/Bookings/Messages/Profile

**1.2 Upgrade Bottom Navigation**
- Edit `src/components/mobile/BottomNavigation.tsx`:
  - Add haptic-style press animation (scale-95 already exists, add spring physics)
  - Add a floating "+" FAB (Floating Action Button) in the center for quick actions (Book Vendor, Create Invite, Wedding Plan)
  - Show bottom nav for non-logged-in users too, but with different tabs (Home, Search, Categories, Tools, Login)

**1.3 Mobile Page Header Component**
- Create `src/components/mobile/MobilePageHeader.tsx`:
  - A slim, sticky top bar with back arrow, page title, and optional action icons
  - Replaces the desktop BhindiHeader on inner pages
  - Used by all pages (Bookings, Messages, Search, Profile, etc.)

**Files to create:** `src/components/mobile/MobilePageHeader.tsx`, `src/components/mobile/QuickActionFAB.tsx`
**Files to edit:** `src/App.tsx`, `src/components/mobile/BottomNavigation.tsx`, `src/components/BhindiFooter.tsx`

---

### Phase 2: Mobile Home Screen (Replace Marketing Page)

**Goal:** Logged-in mobile users see an app home screen, not a marketing landing page.

**2.1 Create Mobile Home Screen**
- Create `src/components/mobile/MobileHomeScreen.tsx`:
  - **Greeting bar**: "Hey [Name]! Your wedding is in X days"
  - **Quick Action Pills**: Horizontal scroll row (Search Vendors, Budget, Checklist, Guest List, Muhurat)
  - **Wedding Countdown Card**: Days/hours/minutes to wedding date
  - **Recent Bookings**: Compact card list of latest 3 bookings
  - **Trending Vendors**: Horizontal scroll carousel
  - **Tools Grid**: 2x3 grid of quick-access tools (Budget Calculator, Invite Creator, Music Generator, Speech Writer, Couple Quiz, Vendor Checker)

**2.2 Conditional Rendering on Index**
- Edit `src/pages/Index.tsx`: If mobile AND logged in, render `MobileHomeScreen` instead of the full marketing page. Non-logged-in users still see the full landing page.

**Files to create:** `src/components/mobile/MobileHomeScreen.tsx`
**Files to edit:** `src/pages/Index.tsx`

---

### Phase 3: Mobile-Optimized Core Pages

**Goal:** Every key page gets a mobile-first layout.

**3.1 Dashboard (Couple)**
- Edit `src/pages/Dashboard.tsx`:
  - On mobile: Remove the 3-button header row (Profile/Settings/Logout -- these live in bottom nav now)
  - Replace 8-column quick actions grid with a 2-column compact grid
  - Stack cards vertically instead of side-by-side
  - Add pull-to-refresh gesture

**3.2 Search Page**
- Edit `src/pages/Search.tsx`:
  - On mobile: Sticky search bar at top (below MobilePageHeader)
  - Category chips as horizontal scroll
  - Vendor results as full-width cards (not grid)
  - Filter as a bottom sheet drawer instead of sidebar

**3.3 Bookings Page**
- Edit `src/pages/Bookings.tsx`:
  - On mobile: Swipeable filter tabs (All, Pending, Confirmed, Completed)
  - Full-width booking cards with status color bar on left edge
  - Tap to expand details

**3.4 Messages Page**
- Already uses `useIsMobile()` for layout -- needs minor tweaks:
  - On mobile: Full-screen conversation view (back arrow to return to list)
  - Floating compose button
  - Message bubbles with proper padding

**3.5 Profile / Settings**
- Edit `src/pages/Profile.tsx` and `src/pages/Settings.tsx`:
  - On mobile: Stack all sections vertically
  - Use list-style navigation (like iOS Settings app)
  - Avatar + name at top, then grouped menu items

**Files to edit:** `src/pages/Dashboard.tsx`, `src/pages/Search.tsx`, `src/pages/Bookings.tsx`, `src/pages/Messages.tsx`, `src/pages/Profile.tsx`, `src/pages/Settings.tsx`

---

### Phase 4: Mobile UX Enhancements

**Goal:** Add app-like interactions and micro-animations.

**4.1 Page Transitions**
- Create `src/components/mobile/PageTransition.tsx`:
  - Wrap route content in framer-motion AnimatePresence
  - Slide-in from right for forward navigation, slide-out-left for back
  - Fade for tab switches

**4.2 Pull-to-Refresh**
- Create `src/hooks/usePullToRefresh.ts`:
  - Custom hook that adds pull-to-refresh on mobile pages
  - Shows a spinner at top and calls a refresh callback
  - Apply to Dashboard, Bookings, Messages, Search

**4.3 Bottom Sheet for Filters/Actions**
- Create `src/components/mobile/BottomSheet.tsx`:
  - Replaces modals/dialogs on mobile with swipeable bottom sheets (using vaul, already installed)
  - Used for Search filters, booking actions, vendor quick inquiry

**4.4 Swipe Gestures**
- Add swipe-to-go-back on inner pages
- Swipe left on booking cards to reveal quick actions (Message, Cancel)

**Files to create:** `src/components/mobile/PageTransition.tsx`, `src/hooks/usePullToRefresh.ts`, `src/components/mobile/BottomSheet.tsx`
**Files to edit:** `src/App.tsx` (wrap Routes in AnimatePresence)

---

### Phase 5: Vendor Mobile Experience

**Goal:** Vendors get an equally polished mobile dashboard.

**5.1 Vendor Dashboard Mobile**
- Edit `src/pages/VendorDashboard.tsx`:
  - On mobile: Replace horizontal tabs with a vertical card-based menu
  - Key stats (bookings, inquiries, revenue) as a compact top strip
  - Quick actions: "View Inquiries", "Update Availability", "Open Toolkit"

**5.2 Vendor Bottom Nav**
- Edit `src/components/mobile/BottomNavigation.tsx`:
  - When user is a vendor, show vendor-specific tabs: Home, Inquiries, Calendar, Tools, Profile
  - This already partially exists (Profile routes to vendor dashboard) -- needs dedicated vendor tabs

**Files to edit:** `src/pages/VendorDashboard.tsx`, `src/components/mobile/BottomNavigation.tsx`

---

### Phase 6: Polish and Platform Consistency

**6.1 Remove Redundant Headers/Footers from All Pages**
- Audit all ~60 pages that import `BhindiHeader` and `BhindiFooter`
- On mobile: Use `MobilePageHeader` instead, hide footer
- On desktop: Keep existing header/footer

**6.2 Touch-Optimized UI**
- Increase all tap targets to minimum 44px on mobile
- Replace hover states with active/pressed states
- Add `active:scale-95` to all interactive cards
- Ensure all inputs are at least 48px height on mobile

**6.3 Typography Mobile Pass**
- Apply the standardized design system consistently:
  - Mobile h1: `text-2xl font-semibold` (not text-3xl+ which is too big on phone)
  - Mobile body: `text-sm` as default
  - Card titles: `text-base font-semibold`

**Files to edit:** Multiple pages (~15-20 key pages need header/footer conditional rendering)

---

## Implementation Order (Recommended)

| Step | What | Effort |
|------|------|--------|
| 1 | Phase 1: Shell + Nav | Medium |
| 2 | Phase 2: Mobile Home | Medium |
| 3 | Phase 3: Core Pages | Large |
| 4 | Phase 4: UX Enhancements | Medium |
| 5 | Phase 5: Vendor Mobile | Medium |
| 6 | Phase 6: Polish | Small |

---

## Technical Notes

- All mobile detection uses the existing `useIsMobile()` hook (768px breakpoint)
- No new dependencies needed -- framer-motion (installed) handles transitions, vaul (installed) handles bottom sheets
- No database changes required -- this is purely a UI/UX transformation
- Desktop experience remains completely unchanged
- The Capacitor native build will automatically benefit from all these changes since it loads the web app

## How to Proceed

Since this is a large transformation, I recommend we tackle it **one phase at a time**. After you approve, I'll start with **Phase 1** (the mobile shell, navigation, and header/footer cleanup) which is the foundation everything else builds on. Each phase can be reviewed and tested before moving to the next.

