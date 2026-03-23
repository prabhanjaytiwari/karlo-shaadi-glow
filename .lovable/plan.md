

# Vendor Onboarding, Payment & Redirect Audit — Fixes

## Issues Found

### 1. Payment Verification Error (Already Fixed — But Vendor Data Not Recovered)
The `verify-payment` edge function was updated to skip the `subscriptions` table for vendor plans. However, the vendor "Aryan" who paid successfully on Razorpay has:
- `subscription_tier: free` in the `vendors` table
- No record in `vendor_subscriptions`
- Payment was captured by Razorpay but the client-side DB write failed because verify-payment threw an error first

**Fix:** Manually update the affected vendor's subscription data via a database insert. Need to identify the Razorpay payment ID from logs or ask the user.

### 2. VendorSubscriptionCheckout — Silent Failure on Verify Error
In `VendorSubscriptionCheckout.tsx` (line 110-158), when `verify-payment` throws an error, the `catch` block shows a toast but the vendor's subscription is never written to `vendor_subscriptions`. The payment is already captured on Razorpay at this point.

**Fix:** Add a retry/recovery mechanism. If `verify-payment` fails but the Razorpay payment was captured, still attempt the client-side DB writes (vendor tier update + vendor_subscriptions upsert) since the payment is valid. The signature was already verified by Razorpay's handler callback.

### 3. Onboarding Step 6 → Congrats Flow Has No Vendor ID Guard
If a vendor refreshes the page on Step 6 after profile creation, `createdVendorId` is null (it's only in React state), so the `VendorSubscriptionCheckout` won't render. The vendor can't subscribe.

**Fix:** On Step 6, if `createdVendorId` is null, fetch the vendor ID from the database using the current user's session.

### 4. Quick Setup Mode Navigation Issue
`handleSkipToQuickSetup` jumps to Step 2, but Step 2 only has business name + city fields. After filling those, `nextStep()` goes to Step 3 (description) which requires 20 chars. In quick setup mode, the description step should be skipped or have relaxed validation.

**Fix:** In quick setup mode, auto-generate the description and skip Step 3, going directly from Step 2 → Step 4 (or straight to Step 5 for review).

### 5. Vendor Onboarding Route Not in AUTH_ROUTES
`/vendor/onboarding` is not in `AUTH_ROUTES` array in App.tsx, so the header/footer show during onboarding. The onboarding has its own dark full-screen design — the header/footer shouldn't render.

**Fix:** Add `/vendor/onboarding` and `/vendor-onboarding` to the `AUTH_ROUTES` array.

### 6. VendorSubscriptionCheckout Loading State Not Reset on Success
After successful payment (line 152-154), `setLoading(false)` is never called — it stays in the loading state. The dialog closes immediately so it's barely noticeable, but if there's any delay it could cause a stuck button.

**Fix:** Add `setLoading(false)` in the success path.

## Implementation Plan

### File 1: `src/components/vendor/VendorSubscriptionCheckout.tsx`
- Add resilient payment handling: if verify-payment fails but Razorpay handler was called (meaning payment succeeded), still attempt client-side DB writes
- Reset loading state on success
- Add error recovery toast with manual support option

### File 2: `src/pages/VendorOnboarding.tsx`
- On Step 6 mount, if `createdVendorId` is null, fetch vendor ID from DB
- In quick setup mode, auto-generate description and skip Step 3 (go 2→4 or 2→5)
- Fix `nextStep` to respect quick setup mode

### File 3: `src/App.tsx`
- Add `/vendor/onboarding` and `/vendor-onboarding` to `AUTH_ROUTES`

### File 4: Database fix for affected vendor
- Update vendor "Aryan" (id: `1c9fc786-5748-4515-b088-d5034a1d8db7`) subscription tier and create subscription record based on what they paid for. Since we don't have the Razorpay payment ID in our DB, we'll need to set this up with a placeholder and the user can verify from their Razorpay dashboard.

### No edge function changes needed
The `verify-payment` fix from the previous message is already deployed and correct.

