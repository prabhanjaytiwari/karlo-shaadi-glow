

# Complete Platform Polish: Fix All Broken Flows, Wiring, and UX

## Issues Found (Full Audit)

### A. Auth Flow Gaps
1. **Auth.tsx has NO session check on mount** — Google OAuth returns to `/` (origin), user lands on auth page already logged in, no redirect happens
2. **Auth.tsx "Register as Vendor" link** still points to `/vendor-auth` instead of `/vendor/onboarding`
3. **Pricing.tsx vendor CTA** still points to `/vendor-auth` instead of `/vendor/onboarding`
4. **VendorGuide.tsx CTAs** still point to `/vendor-auth` instead of `/vendor/onboarding`
5. **MobileHomeScreen "Register as Vendor" button** goes to `/for-vendors` (extra hop) instead of directly to `/vendor/onboarding`
6. **Trending section** has broken route `/earn-with-us` — page is actually at `/earn`

### B. Vendor Image Display
7. **MobileHomeScreen vendor cards** reference `vendor.city` which doesn't exist in the query (query returns `cities (name)`), so city shows undefined
8. **Search page desktop grid cards** don't pass `imageUrl` from `vendor_portfolio` or `logo_url` to VendorCard

### C. Post-Auth Routing
9. **Couple Google OAuth** returns to bare origin → Auth page has no `useEffect` to detect session and redirect to `/dashboard`
10. **Couple email signup** with auto-confirm off shows "check email" but after confirming, returns to origin → no redirect logic to dashboard

### D. Navigation & Link Consistency
11. **Bottom nav "Profile" tab** for couples goes to `/dashboard` instead of `/profile`
12. **Auth page vendor CTA** says "Register as Vendor →" but links to `/vendor-auth` (login page), should go to `/vendor/onboarding`

---

## Implementation Plan

### 1. Add session-check redirect to Auth.tsx
Add `useEffect` on mount that checks for existing session:
- If authenticated couple → redirect to `/dashboard`
- If authenticated vendor → redirect to `/vendor/dashboard`
- If authenticated admin → redirect to `/admin/dashboard`
This fixes Google OAuth return and email confirmation return for couples.

### 2. Fix all stale vendor registration links

**Auth.tsx** (line ~367): Change `to="/vendor-auth"` → `to="/vendor/onboarding"`

**Pricing.tsx** (line ~282): Change `to="/vendor-auth"` → `to="/vendor/onboarding"`

**VendorGuide.tsx** (lines ~220, ~429): Change `to="/vendor-auth"` → `to="/vendor/onboarding"`

**VendorPricing.tsx** (line ~160): Change `navigate('/vendor-auth'` → `navigate('/vendor/onboarding'`

**VendorVerificationStatus.tsx** (line ~50): Change `navigate("/vendor-auth")` → `navigate("/vendor/onboarding")`

### 3. Fix MobileHomeScreen wiring
- Change "Register as Vendor" button to go to `/vendor/onboarding` directly
- Fix vendor city display: `vendor.city` → `vendor.cities?.name`
- Fix Trending route: `/earn-with-us` → `/earn`

### 4. Fix Search.tsx desktop grid image passing
In the desktop grid view, ensure `VendorCard` receives `imageUrl` from the vendor's `logo_url` or first `vendor_portfolio` image (the mobile card already does this correctly via `MobileVendorCard`).

### 5. Fix BottomNavigation Profile tab
Change couple nav "Profile" path from `/dashboard` to `/profile` for consistency.

### 6. Fix Couple auth redirect on Google return
Add `redirect_uri` in Auth.tsx Google OAuth to `${window.location.origin}/auth` so it returns to the auth page, where the new session check will redirect properly.

---

## Files to Modify

1. **`src/pages/Auth.tsx`** — Add session check `useEffect`, fix vendor CTA link, fix Google redirect_uri
2. **`src/pages/Pricing.tsx`** — Fix vendor CTA link
3. **`src/pages/VendorGuide.tsx`** — Fix 2 vendor CTA links
4. **`src/pages/VendorPricing.tsx`** — Fix navigate target
5. **`src/pages/VendorVerificationStatus.tsx`** — Fix navigate target
6. **`src/components/mobile/MobileHomeScreen.tsx`** — Fix vendor city display, vendor register link, earn route
7. **`src/components/mobile/BottomNavigation.tsx`** — Fix Profile tab path
8. **`src/pages/Search.tsx`** — Fix desktop grid VendorCard imageUrl prop

## No database changes needed.

