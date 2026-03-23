

# Fix: Payment Verification Failed for Vendor Subscriptions

## Root Cause

The `verify-payment` edge function always writes to the `subscriptions` table (couple subscriptions) when it receives a `subscriptionPlan` parameter. When a vendor subscribes with plan "starter", "pro", or "elite", these values are invalid for the `subscription_plan` enum on the `subscriptions` table, which only accepts: "free", "premium", "vip", "ai_premium".

Error: `invalid input value for enum subscription_plan: "starter"`

## Fix

### 1. Update `verify-payment` Edge Function

Add a check: if `subscriptionPlan` is a vendor plan ("starter"/"pro"/"elite"), skip the `subscriptions` table upsert entirely. The `VendorSubscriptionCheckout` component already handles writing to `vendor_subscriptions` on the client side after verification succeeds. The edge function only needs to verify the Razorpay signature and return success.

```text
Line 170-235 in verify-payment/index.ts:

IF subscriptionPlan is "starter" | "pro" | "elite":
  → Verify signature only (already done above)
  → Send receipt email with vendor plan name
  → Send push notification
  → Return success (do NOT touch `subscriptions` table)

IF subscriptionPlan is "premium" | "vip":
  → Existing couple subscription logic (upsert to `subscriptions` table)
```

### 2. Fix Redirect After Subscription

The vendor onboarding congratulations screen needs to be triggered after successful payment. Check that `VendorSubscriptionCheckout`'s `onSuccess` callback properly advances to the congratulations step in `VendorOnboarding.tsx`.

### Files Modified
1. `supabase/functions/verify-payment/index.ts` — Add vendor plan detection, skip couple subscription table
2. `src/pages/VendorOnboarding.tsx` — Verify congratulations step wiring (if needed)

