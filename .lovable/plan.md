

# Complete Platform Audit & Fix Plan

## Issues Found (Full Codebase Audit)

### A. Broken Routes & Links

| # | Issue | File | Fix |
|---|-------|------|-----|
| 1 | **Vendor Leaderboard route mismatch** — MobileHomeScreen links to `/vendor-leaderboard` but App.tsx route is `/leaderboard` | `MobileHomeScreen.tsx` line 543 | Change to `/leaderboard` |
| 2 | **Footer "Register as Vendor"** links to `/for-vendors` (extra hop) instead of `/vendor/onboarding` | `BhindiFooter.tsx` line 31 | Change to `/vendor/onboarding` |
| 3 | **Footer "Vendor Login"** links to `/vendor-auth` — correct for login, keep as-is | — | No change needed |
| 4 | **Settings page missing `pb-24`** on mobile — content hidden behind bottom nav | `Settings.tsx` line 40 | Add `pb-24` to mobile main |

### B. Auth & Post-Auth Flow Issues

| # | Issue | File | Fix |
|---|-------|------|-----|
| 5 | **Couple signup with email verification** — after clicking email link, user lands on `/dashboard` via `emailRedirectTo` but if `ProtectedRoute` check hasn't resolved `user_roles` yet, they may briefly flash loading | `Auth.tsx` | Already handled — session check on mount redirects properly |
| 6 | **Magic link for couples** redirects to `/dashboard` directly — works but skips role check | `Auth.tsx` line 97 | Change `emailRedirectTo` to `${window.location.origin}/auth` so session check handles routing |

### C. Data & Display Issues  

| # | Issue | File | Fix |
|---|-------|------|-----|
| 7 | **MobileHomeScreen placeholder vendors** use hard-coded `city` string field instead of `cities` relation — inconsistent with real vendor data structure, but the display line 404 already handles both: `vendor.cities?.name || vendor.city || 'India'` | — | Working correctly, no fix needed |
| 8 | **Vendor images in Search desktop grid** — already fixed with `logo_url` / `vendor_portfolio` fallback chain in previous iteration | — | Confirmed working |

### D. UX Polish & Missing Pieces

| # | Issue | File | Fix |
|---|-------|------|-----|
| 9 | **Settings page mobile layout** — no `pb-24`, content cut off by bottom nav | `Settings.tsx` | Add mobile bottom padding |
| 10 | **Favorites page** — uses `supabase.auth.getUser()` directly instead of `useAuthContext`, causing redundant auth calls | `Favorites.tsx` | Cosmetic — works, low priority |
| 11 | **Messages page** — same pattern as Favorites | `Messages.tsx` | Cosmetic — works, low priority |

### E. Header/Footer Consistency

| # | Issue | Status |
|---|-------|--------|
| 12 | **Desktop header** hides on mobile ✓ | Correct |
| 13 | **Footer** hides on mobile ✓ | Correct |
| 14 | **BottomNavigation** shows correct role-based tabs ✓ | Correct (Profile → `/profile` fixed in prior iteration) |
| 15 | **MobilePageHeader** height `h-14` ✓ | Correct |

### F. Route Coverage Verification

Verified all routes in `App.tsx` (~85 routes) against their linked locations in headers, footers, menus, and CTAs. The following are the only remaining mismatches:

1. `/vendor-leaderboard` (MobileHomeScreen) → should be `/leaderboard`
2. Footer "Register as Vendor" → should be `/vendor/onboarding`
3. Couple magic link `emailRedirectTo` → should route through `/auth` for proper session-based redirect

---

## Implementation Plan

### Fix 1: MobileHomeScreen — broken leaderboard route
**File**: `src/components/mobile/MobileHomeScreen.tsx` line 543
- Change `route: '/vendor-leaderboard'` → `route: '/leaderboard'`

### Fix 2: Footer — vendor registration link
**File**: `src/components/BhindiFooter.tsx` line 31  
- Change `{ label: "Register as Vendor", to: "/for-vendors" }` → `{ label: "Register as Vendor", to: "/vendor/onboarding" }`

### Fix 3: Auth magic link redirect
**File**: `src/pages/Auth.tsx` line 97
- Change `emailRedirectTo: \`${window.location.origin}/dashboard\`` → `emailRedirectTo: \`${window.location.origin}/auth\``
- This ensures the session check on mount handles role-based routing correctly

### Fix 4: Settings page mobile padding
**File**: `src/pages/Settings.tsx` line 40
- Change `"px-4 py-4"` → `"px-4 py-4 pb-24"` for mobile layout

These are the **only remaining issues** after the previous two rounds of fixes. The auth flows, vendor onboarding, image display, navigation, and CTA wiring are all verified working.

