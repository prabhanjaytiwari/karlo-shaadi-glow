

## Issues Found & Fix Plan

### 3 Categories of Problems

---

### 1. Google OAuth Broken on Mobile
**Root cause:** Both `Auth.tsx` and `VendorAuth.tsx` use `supabase.auth.signInWithOAuth()` directly. Lovable Cloud manages Google OAuth and requires using `lovable.auth.signInWithOAuth()` from `@lovable.dev/cloud-auth-js`.

**Fix:** 
- Run the Configure Social Login tool to generate the lovable auth module
- Update `Auth.tsx` and `VendorAuth.tsx` to import from `@/integrations/lovable/index` and use `lovable.auth.signInWithOAuth("google", { redirect_uri: ... })`

---

### 2. Broken Vendor Profile Links (Wrong Route)
**Route defined in App.tsx:** `/vendors/:id`  
**Links used across code:** `/vendor/${id}` (missing the "s")

This means clicking any vendor card navigates to a 404. Found in **4 files**:
- `MobileHomeScreen.tsx` → `/vendor/${vendor.id}`
- `AIMatchResults.tsx` → `/vendor/${vendor.id}`
- `VendorSuccessStories.tsx` → `/vendor/${vendor.id}`
- `BookingConfirmation.tsx` → `/vendor/${booking.vendor.business_name}`

**Fix:** Change all to `/vendors/${id}`

---

### 3. Remaining Duplicate BhindiHeaders (16 pages still have them)
Despite previous cleanup, 16 pages still import and render `<BhindiHeader />` manually while `App.tsx` already renders it globally. This causes double headers.

**Pages:** `WeddingWebsite`, `JoinAsManager`, `InviteCreatorPage`, `MusicGenerator`, `PremiumUpgrade`, `SubscriptionCheckout`, `VendorSuccessStories`, `SuccessStories`, `Affiliate`, `VendorLeaderboard`, `AIMatchResults`, and ~5 more from the search results.

**Fix:** Remove `BhindiHeader` import and JSX from all 16 pages.

---

### 4. Mobile Home Page — More Sections
Current MobileHomeScreen has 10 sections. Adding 3 more:
- **Deals & Offers** section — horizontal scroll of deal cards linking to `/deals`
- **Wedding Directory** section — city grid (Delhi, Mumbai, Bangalore, Jaipur, Lucknow, Kolkata) linking to `/vendors-in/:city`
- **Trending on Karlo Shaadi** section — badges linking to viral tools (Shaadi Wrapped, Earn With Us, Why Karlo Shaadi)

---

### Changes Summary

| File | Change |
|------|--------|
| Configure Social Login tool | Generate lovable auth module |
| `Auth.tsx` | Use `lovable.auth.signInWithOAuth("google")` |
| `VendorAuth.tsx` | Use `lovable.auth.signInWithOAuth("google")` |
| `MobileHomeScreen.tsx` | Fix vendor route `/vendors/`, add 3 new sections |
| `AIMatchResults.tsx` | Fix `/vendor/` → `/vendors/` route |
| `VendorSuccessStories.tsx` | Fix `/vendor/` → `/vendors/` route |
| `BookingConfirmation.tsx` | Fix `/vendor/` → `/vendors/` route |
| 16 pages | Remove duplicate `BhindiHeader` imports + JSX |

