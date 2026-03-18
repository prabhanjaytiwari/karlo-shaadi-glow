
Goal: Fix the broken vendor journey end-to-end so new vendors always get onboarding, existing vendors get login, and vendor images actually show in discovery.

1) Root causes found
- Google OAuth from vendor screens uses `redirect_uri: window.location.origin`, so users return to generic entry points instead of vendor onboarding.
- Vendor signup role assignment is metadata-based (`business_name`), but onboarding Step 0 signup does not send business metadata; this causes role/route mismatch after auth.
- Vendor auth page is login-only but lacks robust “already signed-in” post-return handling for OAuth/magic-link return cases.
- Vendor search cards (mobile + desktop Search) render initials only; they don’t use `logo_url`/portfolio images.
- Mobile home vendor query uses non-existent vendor fields (`city`, `portfolio_images`), so image/data fallback behavior is inconsistent.
- “Register” CTAs in `ForVendors` still point to `/vendor-auth` instead of `/vendor/onboarding`.

2) Implementation plan (single pass)

A. Stabilize vendor auth + onboarding routing
- Add a shared auth redirect helper for Google OAuth so vendor flows always target `/vendor/onboarding`.
- Update Google OAuth in:
  - `src/pages/VendorOnboarding.tsx`
  - `src/pages/VendorAuth.tsx`
  - (keep couple flow unchanged in `Auth.tsx`)
- In `VendorAuth.tsx`, add mount-time session check:
  - if signed in + vendor profile exists → `/vendor/dashboard`
  - if signed in + no vendor profile → `/vendor/onboarding`
- Keep vendor onboarding public route as-is and preserve Step 0 → Step 1 auto-skip behavior.

B. Make vendor role assignment deterministic (backend)
- Add migration to ensure users who create a vendor profile always receive vendor role:
  - Trigger/function on `vendors` insert to upsert (`user_id`, `vendor`) in `user_roles`.
  - Backfill existing vendors missing vendor role.
- This removes dependency on fragile signup metadata and fixes redirect/authorization glitches after onboarding.

C. Fix onboarding entry points
- Update all “new vendor/register/free profile” CTAs in `src/pages/ForVendors.tsx` from `/vendor-auth` to `/vendor/onboarding`.
- Keep “already have account” actions pointing to `/vendor-auth`.

D. Fix vendor image visibility across discovery
- `src/pages/Search.tsx`
  - Extend vendor query to include `logo_url` + `vendor_portfolio(image_url, display_order)`.
  - Render image in mobile and desktop cards with fallback chain:
    1) `logo_url`
    2) first portfolio image
    3) initials gradient
- `src/components/VendorCard.tsx` remains reusable; ensure callers pass imageUrl consistently.
- `src/pages/CityVendors.tsx`
  - Use `imageUrl={vendor.logo_url || vendor.vendor_portfolio?.[0]?.image_url}`.
- `src/components/mobile/MobileHomeScreen.tsx`
  - Replace invalid select fields with valid relational select (`cities`, `vendor_portfolio`, `logo_url`), then use same fallback chain.

E. Guardrails for post-auth consistency
- Ensure no async DB calls are awaited inside auth event callback bodies without deferral patterns (already partially respected in app).
- Keep loading states during auth return and route decision to prevent flicker/“signed in but stuck” perception.

3) Files to update
- `src/pages/VendorOnboarding.tsx`
- `src/pages/VendorAuth.tsx`
- `src/pages/ForVendors.tsx`
- `src/pages/Search.tsx`
- `src/pages/CityVendors.tsx`
- `src/components/mobile/MobileHomeScreen.tsx`
- `supabase/migrations/<new_vendor_role_sync>.sql`

4) Validation checklist (what I’ll test after implementation)
- New vendor via Google from onboarding lands in Step 1+ wizard (not generic logged-in state).
- New vendor via email signup + email verify returns to onboarding and continues.
- Existing vendor via `/vendor-auth` lands on dashboard.
- Existing non-profile vendor via `/vendor-auth` lands on onboarding.
- Vendor dashboard access works immediately after onboarding completion.
- Vendor cards show real images/logo in Search, City vendors, and mobile home sections.
- No regressions to couple auth flow.

5) Technical notes
- No new tables required.
- Minimal backend change: one migration for reliable role sync and backfill.
- RLS remains intact for `vendors`/`vendor_portfolio`; image visibility is primarily a frontend query/render wiring issue.
