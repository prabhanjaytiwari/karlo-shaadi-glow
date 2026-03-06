

## Issues Found & Fix Plan

### 1. Duplicate Footer on Home Page
**Root cause:** `Index.tsx` renders `<BhindiFooter />` at line 532, AND `App.tsx` renders `<BhindiFooter />` globally at line 253. On desktop, both render — two footers stacked.

**Fix:** Remove the `<BhindiFooter />` import and usage from `src/pages/Index.tsx` (line 1 and line 532). The global footer in App.tsx already handles it.

---

### 2. Dashboard & Profile Redirect Loop for Admin
**Root cause:** The admin user (prabhanjaytiwari@gmail.com) only has the `admin` role in `user_roles`. When they log in via Google OAuth, `Auth.tsx` redirects them to `/admin/dashboard`. When the admin tries to visit `/dashboard` or `/profile`:

- `Dashboard.tsx` (line 43-48): Calls `getUser()`, checks if user is a vendor. Admin isn't a vendor, so it proceeds. But the real problem is in `ProtectedRoute` — when auth state changes fire, `checkAccess` re-runs. If there's a timing issue with multiple auth events, the admin can get bounced.
- More critically, `Dashboard.tsx` and `Profile.tsx` do their OWN auth checks redundantly (calling `supabase.auth.getUser()` directly instead of using `useAuthContext()`), which races with ProtectedRoute.

**Fix:**
- Update `ProtectedRoute.tsx` to NOT redirect when `requireRole` is not set. Currently it only redirects when `requireRole` is set and user lacks that role — but the admin gets redirected because they have `admin` role and the fallback at line 53 sends them to `/admin/dashboard`. The `/dashboard` route has no `requireRole`, so this shouldn't trigger. Need to verify timing.
- Actually, the real fix: `/dashboard` and `/profile` routes have `<ProtectedRoute>` with NO `requireRole`. So ProtectedRoute line 38 (`if (requireRole && session)`) is false — the role check block is skipped entirely. The redirect must be happening from within `Dashboard.tsx` itself. Let me re-check...
  
  Dashboard.tsx does: check user → check if vendor → if vendor, redirect to vendor dashboard. Admin is not a vendor, so it should load. BUT — if the admin has BOTH `admin` and `couple` roles, or just `admin`, the dashboard loads fine. Unless the profile query fails for admin...

  After deeper analysis: the issue is likely that on the `onAuthStateChange` listener in ProtectedRoute (line 82-92), when `SIGNED_IN` fires, `checkAccess` runs again. If there's a stale `isAuthorized` reference in the closure, it might re-trigger the role redirect path. The dependency array includes `isAuthorized` implicitly through the callback but uses the initial value. This is a race condition.

**Proper fix for ProtectedRoute:**
- Remove the redundant `onAuthStateChange` listener from ProtectedRoute — it already checks on mount, and re-checking on every auth event causes loops
- OR: Only listen for `SIGNED_OUT` events, remove the re-check on `SIGNED_IN`

**Proper fix for Dashboard.tsx & Profile.tsx:**
- Replace direct `supabase.auth.getUser()` calls with `useAuthContext()` to avoid race conditions with ProtectedRoute's own auth checks

---

### 3. Navigation & Mobile UX Systematization

**Current state:** The header (`BhindiHeader`) hides on mobile for some pages, `MobileHomeScreen` has its own nav. Bottom navigation exists but routing is fragmented.

**Fixes:**
- **BhindiHeader on mobile:** Verify it hides properly on mobile (MobileHomeScreen has its own header). Currently BhindiHeader doesn't check `isMobile` to hide — it should hide on mobile since MobilePageHeader and BottomNavigation handle mobile nav.
- **Auth flow cleanup:** After login, redirect based on role consistently. Admin → `/admin/dashboard`, Vendor → `/vendor/dashboard`, Couple → `/dashboard`. Same logic everywhere (Auth.tsx already does this).
- **Profile/Settings access for admin:** Add admin-aware routing so admin can still view their profile. Currently Dashboard.tsx line 47 checks vendor table — should also check admin role and render appropriately.

---

### Summary of Changes

| File | Change |
|------|--------|
| `src/pages/Index.tsx` | Remove duplicate `<BhindiFooter />` (line 1 import + line 532) |
| `src/components/ProtectedRoute.tsx` | Fix onAuthStateChange: only handle SIGNED_OUT, remove re-check on SIGNED_IN to prevent redirect loops |
| `src/pages/Dashboard.tsx` | Use `useAuthContext()` instead of direct `supabase.auth.getUser()`, handle admin users properly |
| `src/pages/Profile.tsx` | Use `useAuthContext()` instead of direct auth check, handle admin users |
| `src/components/BhindiHeader.tsx` | Hide on mobile (return null when `isMobile`) since BottomNavigation + MobilePageHeader handle mobile nav |

