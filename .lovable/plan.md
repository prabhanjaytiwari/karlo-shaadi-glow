

# Production Readiness Fix Plan

## Current State Assessment

After thorough codebase review, here's what's **already done** vs **needs fixing**:

### Already Working ✓
- Razorpay SDK script tag is **already in `index.html`** (line: `<script src="https://checkout.razorpay.com/v1/checkout.js"></script>`)
- `create-payment` edge function **exists and is deployed** (configured in `config.toml`)
- `verify-payment` edge function **exists and is deployed** with full booking/subscription update logic
- Welcome email edge function **exists** as `onboarding-email` (already invoked in Auth.tsx and VendorOnboarding.tsx)
- Payment verification **already updates** bookings table (status → confirmed) and payments table (status → paid)
- `handle_new_user` database trigger **already auto-assigns** couple/vendor role on signup
- Storage buckets **already created**: vendor-portfolio, review-photos, booking-documents, vendor-logos, wedding-images, etc.
- RLS policies are **already configured** on all tables
- `useAuthContext()` is **already used** in key components (Index, Dashboard, Profile, BottomNavigation, MobileHomeScreen)
- Razorpay key is returned from edge function (`orderData.keyId` / `orderData.razorpayKeyId`) — no `VITE_RAZORPAY_KEY_ID` needed client-side

### Actual Remaining Fixes

---

## PRIORITY 1 — No Production Blockers Remaining
All payment infrastructure is in place. Nothing to fix here.

---

## PRIORITY 2 — Auth Fixes (3 items)

### Fix 1: ProtectedRoute — use useAuthContext instead of direct getSession
**File**: `src/components/ProtectedRoute.tsx`
- Replace the entire `checkAccess` function that calls `supabase.auth.getSession()` and `supabase.from("user_roles")` directly
- Instead, consume `useAuthContext()` for `user`, `loading`, `hasRole`, `isAdmin`, `isVendor`, `isCouple`
- This eliminates redundant auth calls and ensures consistency with the rest of the app
- Keep the redirect logic (admin → admin dashboard, vendor → vendor dashboard, etc.)

### Fix 2: useAuth.ts — remove setTimeout workaround
**File**: `src/hooks/useAuth.ts` (lines 31-35)
- The `setTimeout(() => fetchUserRoles(...), 0)` is a workaround for Supabase auth deadlocks
- Replace with a proper pattern: set a flag and fetch roles in a separate `useEffect` that watches `user` state changes
- This ensures roles are fetched reliably without relying on setTimeout timing

### Fix 3: VendorAuth — add registration tab
**File**: `src/pages/VendorAuth.tsx`
- Currently login-only. Add a "New Vendor? Register here" link/button that redirects to `/vendor/onboarding`
- The actual registration flow already lives in VendorOnboarding with Step 0 auth. No need to duplicate — just add a clear CTA.

---

## PRIORITY 3 — Data Security
Storage buckets and RLS policies are **already configured**. Bucket policies are already set (public read for portfolio/logos, private for booking-documents). No changes needed.

---

## PRIORITY 4 — Mobile Polish (2 items)

### Fix 4: AdminDashboard — prevent horizontal scroll on mobile
**File**: `src/pages/AdminDashboard.tsx`
- Add `overflow-x-hidden` to the root container
- Wrap `TabsList` in a scrollable container with `overflow-x-auto` for many tabs
- Add `min-w-0` to table containers and `whitespace-nowrap` with `overflow-x-auto` on table wrappers

### Fix 5: VendorDashboard — prevent horizontal scroll on mobile
**File**: `src/pages/VendorDashboard.tsx`
- Same treatment: `overflow-x-hidden` on root, scrollable `TabsList`, constrained table widths

---

## PRIORITY 5 — Cleanup (2 items)

### Fix 6: ComingSoon route clarity
- The `/coming-soon` route is a merch pre-order page (T-shirts, voice notes). It's a proper feature, not a placeholder. **No change needed.**

### Fix 7: AI-dependent features status
- **FamilyFrame**: Calls `generate-family-frame` edge function (exists in `/supabase/functions/`). Has real backend.
- **AI Match**: Calls `smart-vendor-matching` edge function (exists, configured in config.toml). Has real backend.
- Both are functional — **no change needed.**

---

## Summary: 5 actual code changes

| # | Task | File |
|---|------|------|
| 1 | ProtectedRoute → useAuthContext | `ProtectedRoute.tsx` |
| 2 | useAuth.ts → remove setTimeout | `useAuth.ts` |
| 3 | VendorAuth → add register CTA | `VendorAuth.tsx` |
| 4 | AdminDashboard mobile scroll fix | `AdminDashboard.tsx` |
| 5 | VendorDashboard mobile scroll fix | `VendorDashboard.tsx` |

