

# Karlo Shaadi — Complete Platform Wireframe, Flow Map & Audit

---

## 1. PLATFORM ARCHITECTURE

```text
┌─────────────────────────────────────────────────────────────────┐
│                        KARLO SHAADI                             │
├──────────┬──────────┬──────────┬──────────┬─────────────────────┤
│  COUPLE  │  VENDOR  │  ADMIN   │  PUBLIC  │   VIRAL TOOLS       │
│   FLOW   │   FLOW   │   FLOW   │  PAGES   │   (No Login)        │
└──────────┴──────────┴──────────┴──────────┴─────────────────────┘
```

### Entry Points
- `/` — Landing page (desktop) / MobileHomeScreen (mobile)
- `/auth` — Couple login/signup (email, Google, magic link)
- `/vendor-auth` — Vendor login/signup
- `/onboarding` — 4-slide app walkthrough

---

## 2. COUPLE FLOW (Authenticated)

```text
/auth (Login/Signup)
  │
  ▼
/dashboard ─────────────────────────────────────────────
  │  Wedding countdown, profile %, quick actions grid   │
  │                                                     │
  ├─→ /search ──→ /vendors/:id ──→ Book ──→ /checkout/:id ──→ /payment-success
  │                   │                                          │
  │                   ├─→ Quick Inquiry (Get Quote)              │
  │                   ├─→ WhatsApp Chat                          │
  │                   └─→ Favorite / Compare                     │
  │                                                     │
  ├─→ /bookings ──→ /booking/:id (details, cancel, final payment)
  ├─→ /messages (realtime chat with vendors)
  ├─→ /favorites (saved vendors)
  ├─→ /checklist (wedding task tracker)
  ├─→ /budget (category-wise budget tracker)
  ├─→ /guest-list (RSVP, table assignments)
  ├─→ /moodboards (inspiration boards)
  ├─→ /achievements (gamification badges)
  ├─→ /referrals (refer & earn credits)
  ├─→ /wedding-website (build & publish wedding site)
  ├─→ /shaadi-wrapped (year-in-review shareable)
  ├─→ /profile (edit personal info)
  ├─→ /settings (password, notifications, delete account)
  ├─→ /premium-upgrade ──→ /subscription-checkout
  └─→ /data-export
```

---

## 3. VENDOR FLOW (Authenticated, role=vendor)

```text
/vendor-auth (Login/Signup)
  │
  ▼
/vendor/onboarding (4-step: Business → Location → Details → Logo)
  │
  ▼
/vendor/dashboard ──────────────────────────────────────
  │  Tabs: Analytics | Bookings | Services | Portfolio  │
  │        Messages | Reviews | Profile | Inquiries     │
  │        Badge | Upgrade | Tools                      │
  │                                                     │
  ├─→ Analytics tab (stats, revenue charts, conversion)
  ├─→ Bookings tab (manage booking cards, confirm/reject)
  ├─→ Services tab (add/edit service packages with pricing)
  ├─→ Portfolio tab (upload images, bulk upload, video embed)
  ├─→ Messages tab (inbox, reply to couples)
  ├─→ Reviews tab (respond to reviews)
  ├─→ Profile tab (edit business info, availability calendar)
  ├─→ Inquiries tab (CRM pipeline: New→Contacted→Converted→Closed)
  ├─→ Badge tab (download verified badge for social/website)
  ├─→ Upgrade tab (Silver/Gold/Diamond subscription checkout)
  └─→ Tools tab (VendorToolkit):
        ├─→ CRM (Kanban lead pipeline)
        ├─→ Payments (milestone scheduler) [Silver+]
        ├─→ Contracts (legal template generator) [Silver+]
        ├─→ Comms (client messaging templates)
        ├─→ Follow-Ups (reminder tracker)
        ├─→ Mini-Site (public portfolio page) [Gold+]
        ├─→ Insights (business intelligence) [Gold+]
        ├─→ AI Quotes (auto-generate quotes)
        ├─→ Captions (Instagram caption generator)
        ├─→ Invoice (PDF invoice generator)
        └─→ Demand (seasonal insights)

/vendor/settings (business settings)
/vendor/billing (payment history)
/vendor/verification (verification status)
/vendor-site/:slug (public mini-site)
```

---

## 4. ADMIN FLOW (role=admin)

```text
/admin/dashboard
  ├─→ Overview tab (stats: vendors, bookings, revenue, reviews)
  ├─→ Vendors tab (approve/reject, search, filter by category)
  ├─→ Verification Panel (document review, verify vendors)
  ├─→ Bookings tab (all platform bookings)
  ├─→ Reviews tab (flagged reviews moderation)
  ├─→ Stories tab (moderate user-submitted wedding stories)
  ├─→ Analytics tab (platform-wide analytics dashboard)
  ├─→ Payments tab (test payment panel)
  └─→ Shaadi Seva tab (fund tracking, outreach management)
```

---

## 5. VIRAL TOOLS (No Login Required)

```text
/tools (landing page hub)
  ├─→ /plan-wizard ──→ /plan/:planId (AI wedding plan generator)
  ├─→ /budget-calculator (category-wise budget breakdown)
  ├─→ /muhurat-finder (auspicious date finder 2025)
  ├─→ /invite-creator (AI digital invitation maker)
  ├─→ /music-generator (AI wedding song creator) [requires login]
  ├─→ /speech-writer (wedding speech/toast writer)
  ├─→ /couple-quiz (compatibility quiz with shareable results)
  ├─→ /budget-roast (humorous AI budget reality check)
  ├─→ /vendor-check (ghost vendor trust score checker)
  └─→ /countdown/:slug (public wedding countdown page)
```

---

## 6. PUBLIC / SEO PAGES

```text
/categories, /category/:category
/city/:slug, /vendors/:city/:category, /vendors-in/:city
/stories, /stories/:id
/deals
/compare
/for-vendors, /vendor-pricing, /vendor-success-stories, /vendor-guide
/about, /legal, /privacy, /cancellation-refunds, /shipping
/faq, /help, /support
/blog, /blog/:id
/testimonials, /success-stories
/pricing
/investors, /join-as-manager, /affiliate, /earn
/shaadi-seva
/wedding-directory, /web-stories
/why-karlo-shaadi, /sponsor-shaadi
/leaderboard (vendor leaderboard)
/embed (embeddable widget)
```

---

## 7. CRITICAL BUGS & ISSUES FOUND

### A. Authentication & Security
1. **BottomNavigation duplicates auth logic** — It independently calls `supabase.auth.getUser()` and `onAuthStateChange` instead of using `useAuthContext()`. This creates redundant auth listeners and potential race conditions.
2. **AdminDashboard double-checks admin access** — Already wrapped in `<ProtectedRoute requireRole="admin">` but then re-checks with its own `checkAdminAccess()`. Redundant, but not harmful.
3. **Bookings page calls `supabase.auth.getUser()` directly** instead of using `useAuthContext()`. Same pattern in Messages, Checkout, VendorProfile — inconsistent auth access across pages.
4. **Guest users see "Bookings" in bottom nav** — Clicking navigates to `/bookings` which redirects to `/auth`. Should show "Deals" or "Plans" instead.

### B. Navigation & UX Issues
5. **FAB spacer still rendered** — Line 143-147 of BottomNavigation still inserts a `w-14` spacer div between nav items 2 and 3 for logged-in users, even though QuickActionFAB was removed. This creates a dead gap in the nav bar.
6. **Sparkles icon still used in 55 files** — If the user's earlier request was to remove ALL sparkle icons platform-wide, only MobileHomeScreen and BottomNavigation were cleaned. Sparkles remains in VendorCard, BudgetCalculator, AIMatchmakingDialog, StoryDetail, VendorSubscriptionCheckout, Search, and ~50 other files. (Clarification needed: user may have only meant the floating FAB sparkle, not the lucide icon used decoratively.)
7. **ToolsLanding still says "AI Wedding Planner"** — The memory says branding was updated to remove "AI" prefixes, but line 22-24 of ToolsLanding.tsx still shows "AI Wedding Planner".

### C. Data & Functionality Gaps
8. **No real-time message delivery indicators** — Messages page sets up realtime subscription but `typingUsers` state is initialized and never populated (no typing indicator logic exists).
9. **Vendor category mismatch** — MobileHomeScreen lists category `'venue'` but VendorOnboarding CATEGORIES uses `'venues'` (plural). Search by category from mobile home will return zero results for venues.
10. **Vendor search city filter uses `selectedCity` compared against vendor `city.name`** — but the city relationship isn't explicitly joined in the search query. Need to verify the Supabase query actually resolves city names.
11. **No email verification enforcement** — Auth signup uses `supabase.auth.signUp()` but there's no UI feedback about checking email for verification. Users may think signup failed.
12. **Music Generator requires login** but is listed as a "no-login" viral tool on MobileHomeScreen and ToolsLanding.

### D. Indian Wedding Industry Gaps
13. **Missing vendor categories for Indian market**:
    - **Florists** (separate from decoration)
    - **Bridal Lehenga / Sherwani shops** (fashion/clothing)
    - **Henna/Mehendi artists** exist but no **Sangeet choreographers** as distinct from generic choreography
    - **Dhol / Baraat band** (separate from generic "Music & DJ")
    - **Tent & Furniture / Shamiyana** (massive Indian wedding category)
    - **Fireworks / Aatishbaazi** vendors
    - **Wedding card printers** (physical, not digital)
14. **No regional language support** — Indian weddings span 20+ languages. At minimum Hindi toggle would dramatically expand reach.
15. **No multi-event booking** — Indian weddings have 5-7 functions (Haldi, Mehendi, Sangeet, Wedding, Reception). Current booking is single-event. Couples should book vendors for specific functions.
16. **No family-side management** — Indian weddings involve two families. No concept of "bride side" vs "groom side" budget split, guest lists, or vendor assignments.
17. **No baraat/vidaai timeline support** — The checklist is generic. Indian-specific rituals (Roka, Tilak, Haldi, Mehendi, Sangeet, Baraat, Phere, Vidaai, Reception) should be pre-populated.
18. **No vendor negotiation support** — Price negotiation is standard in Indian weddings. No quote comparison or counter-offer mechanism exists.

### E. Technical Debt
19. **VendorProfile page uses `any` type** for vendor, services, portfolio — no type safety.
20. **Dashboard directly queries `supabase.from("profiles")` inline** instead of using React Query — no caching, no deduplication.
21. **MobileHomeScreen is 679 lines** — massive component that should be split into sub-components for maintainability.
22. **Multiple pages import `Sparkles` from lucide but may not use it** — dead imports after previous removals.

---

## 8. RECOMMENDED ADDITIONS (Priority Order)

| Priority | Feature | Why (Indian Market) |
|----------|---------|---------------------|
| P0 | **Fix venue/venues category mismatch** | Venues are #1 searched category — currently broken on mobile |
| P0 | **Remove FAB spacer from BottomNavigation** | Dead gap visible to every mobile user |
| P1 | **Multi-function booking** | Indian weddings = 5-7 events, not 1 |
| P1 | **Hindi language toggle** | 50%+ of target users prefer Hindi |
| P1 | **Vendor negotiation / counter-quote** | Standard Indian wedding workflow |
| P2 | **Bride/Groom side split** | Budget, guests, vendors per family side |
| P2 | **Tent & Shamiyana category** | Massive unserved vendor category |
| P2 | **Baraat band / Dhol category** | Distinct from DJ, huge demand |
| P3 | **Pre-populated Indian ritual checklist** | Roka → Tilak → Haldi → ... → Reception |
| P3 | **Vendor availability by function type** | "Available for Sangeet on Dec 15?" |

---

## 9. MOBILE BOTTOM NAVIGATION (Current State Issue)

```text
Current (logged-in couple):
┌──────┬──────┬──[GAP]──┬──────┬──────┐
│ Home │Vendor│  EMPTY  │ Book │ Msgs │ Profile
└──────┴──────┴─────────┴──────┴──────┘
                  ↑
           FAB removed but
           spacer div remains

Should be:
┌──────┬──────┬──────┬──────┬──────┐
│ Home │Vendor│ Book │ Msgs │ You  │
└──────┴──────┴──────┴──────┴──────┘
```

