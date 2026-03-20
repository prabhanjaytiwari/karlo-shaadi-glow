

# Fix Plan: Vendor Interface, Role Switching, UI/UX, and Welcome Emails

## Issues Identified

1. **After vendor signup via Google OAuth, redirected to couple dashboard** — The `Auth.tsx` Google sign-in redirects to `/auth` callback, and the session check there routes to `/dashboard` (couple) because the vendor role hasn't been assigned yet at that point.

2. **Header shows couple-oriented navigation for vendors** — `BhindiHeader.tsx` shows same Tools dropdown (AI Plan, Budget Calculator, Muhurat Finder etc.) and quick actions (Bookings, Favorites, Messages for couples) regardless of role. No role-switching UI exists.

3. **Vendor Dashboard UI/UX is unprofessional** — Bookings tab has overlapping layout (calendar + booking list + "Select a Date" card squeezed together), inconsistent spacing, cards without proper margins on the grid layout.

4. **No welcome email delivered** — The `onboarding-email` Edge Function uses Resend, but the sender domain `karloshaadi.com` likely isn't verified in Resend. The function itself is correctly coded and the RESEND_API_KEY secret exists.

---

## Plan

### 1. Fix Post-Signup Redirect for Vendors

**File:** `src/pages/Auth.tsx`
- The Google OAuth `redirectTo` points to `/auth`. When vendors sign up via the couple auth page's Google button, they land back on `/auth` and get routed to `/dashboard`.
- This is actually correct behavior for couple auth — the real issue is vendors using the couple Google OAuth. The vendor onboarding already handles its own Google redirect to `/vendor/onboarding`.
- **Fix:** In `Dashboard.tsx`, enhance the mount check: if user has no role yet but has a vendor profile, redirect to `/vendor/dashboard`. Currently it only checks `isVendor` from roles.

### 2. Role-Aware Header Navigation (Fiverr/Upwork-style Role Switcher)

**File:** `src/components/BhindiHeader.tsx`

- Add a **role switcher** dropdown near the user controls when the user has both couple and vendor roles (or is a vendor):
  - "Switch to Couple View" / "Switch to Vendor View" toggle
  - Store active view mode in localStorage
- **Vendor-specific navigation**: When in vendor mode, replace couple Tools dropdown with vendor tools:
  - CRM, Contracts, Invoices, Analytics, Mini-Site instead of AI Plan, Budget Calculator, Muhurat Finder
- Replace couple quick actions (Bookings/Favorites/Messages for couples) with vendor equivalents
- Change "Dashboard" link to always point to correct dashboard based on active role

### 3. Vendor Dashboard UI/UX Overhaul

**File:** `src/pages/VendorDashboard.tsx`

- **Bookings tab layout fix** (lines 610-644): The `grid lg:grid-cols-[2fr_1fr]` causes the calendar and booking list to overlap on medium screens. Fix:
  - Use proper responsive breakpoints with gap spacing
  - Remove the redundant "Select a Date" card that overlaps the calendar
  - Add proper padding/margins to the stats grid and tab content
- **Stats cards**: Improve spacing with consistent `gap-4` on mobile, `gap-6` on desktop
- **Subscription status card**: Clean up the margins, reduce border width from `border-2` to `border`
- **Profile completion progress**: Add proper `mb-6` spacing
- **Tab content areas**: Ensure all tab panels have consistent padding

### 4. Welcome Email Fix

**File:** `supabase/functions/onboarding-email/index.ts`

- The edge function uses Resend with `noreply@karloshaadi.com` as sender. For this to work, the domain must be verified in Resend.
- **Check:** The `RESEND_API_KEY` exists. The likely issue is domain verification in Resend OR the function not being deployed.
- **Action:** Redeploy the `onboarding-email` edge function to ensure latest code is live.
- **Fallback:** If Resend domain isn't verified, update sender to use Resend's default `onboarding@resend.dev` temporarily OR set up Lovable email infrastructure as the proper solution.

---

## Technical Details

### Role Switcher Component
```text
┌─────────────────────────────────┐
│  [Vendor Mode ▼]                │
│  ┌───────────────────┐          │
│  │ 👤 Couple View     │          │
│  │ 🏪 Vendor View  ✓  │          │
│  └───────────────────┘          │
└─────────────────────────────────┘
```

### Files to Create/Edit
- `src/components/BhindiHeader.tsx` — Role-aware nav + role switcher
- `src/pages/VendorDashboard.tsx` — UI/UX fixes for bookings tab, stats, spacing
- `src/pages/Dashboard.tsx` — Add vendor profile fallback check
- `src/components/RoleSwitcher.tsx` — New component for Fiverr-style role toggle
- Redeploy `onboarding-email` edge function

### Estimated Changes
- ~5 files modified, 1 new component
- Focus on spacing, layout grid fixes, and role-conditional rendering

