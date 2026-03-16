

# Fix: Vendor Onboarding Flow After Registration

## Problem
After signing up on `/vendor-auth`, vendors stay stuck on the auth page. The onboarding wizard at `/vendor/onboarding` never opens because:
1. Email confirmation blocks navigation (user stays on auth page with "check email" message)
2. After confirming email, the redirect link may not restore session properly
3. The signup form on VendorAuth collects redundant info (business name, phone) that the onboarding wizard also asks for

## Solution
Restructure the flow so auth is embedded INTO the onboarding wizard:

**VendorAuth (`/vendor-auth`)** → Login-only page for existing vendors
**VendorOnboarding (`/vendor/onboarding`)** → Public page with Step 0: Create Account, then Steps 1-6 wizard

### Changes

**1. `src/pages/VendorOnboarding.tsx`**
- Make it a public page (remove ProtectedRoute in App.tsx)
- Add a new **Step 0: "Create Your Account"** before the current Step 1
  - Email, password, name fields + Google OAuth button
  - On signup success, auto-advance to Step 1 (category selection)
  - If already authenticated, skip Step 0 automatically
- Total steps become 7 (0-6) but display as steps 1-6 to the user (Step 0 is "Get Started")
- After email confirmation link is clicked, user lands back on `/vendor/onboarding` and resumes from Step 1

**2. `src/pages/VendorAuth.tsx`**
- Remove the Signup tab entirely
- Keep only Login + Magic Link + Google for existing vendors
- Add a prominent "New vendor? Start your journey →" link that navigates to `/vendor/onboarding`

**3. `src/App.tsx`**
- Change `/vendor/onboarding` route to be public (no ProtectedRoute wrapper)
- Keep `/vendor-onboarding` as alias

### Flow
```text
New vendor clicks "Register as Vendor"
  → /vendor/onboarding (Step 0: Create Account)
  → Signs up → Email confirmation sent
  → Clicks email link → Returns to /vendor/onboarding
  → Session detected → Auto-skips to Step 1
  → Completes Steps 1-6 → Dashboard

Existing vendor clicks "Login"
  → /vendor-auth (Login only)
  → Has vendor profile? → /vendor/dashboard
  → No vendor profile? → /vendor/onboarding (skips Step 0)
```

### No database changes needed

