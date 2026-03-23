

# Recurring Payments, SUPER90 Promo Code & Cancellation System

## Current State

The vendor checkout currently uses **one-time Razorpay Orders** (`create-payment` edge function). The `create-vendor-subscription` edge function exists and creates actual **Razorpay Subscriptions** (recurring), but the checkout component doesn't use it. The webhook handler (`vendor-subscription-webhook`) already handles all subscription lifecycle events (charged, cancelled, halted, etc.) correctly.

## Changes

### 1. Add SUPER90 Promo Code
**File:** `src/lib/promoCodes.ts`
- Add `{ code: 'SUPER90', discountPercent: 90, description: '90% off on any subscription', applicableTo: 'all', active: true }`

### 2. Switch Checkout to Razorpay Subscriptions API
**File:** `src/components/vendor/VendorSubscriptionCheckout.tsx`

Replace the current one-time payment flow with Razorpay's subscription checkout:
- Call `create-vendor-subscription` instead of `create-payment`
- Use `razorpay.createPayment()` with subscription_id instead of order_id
- On successful first payment, Razorpay auto-charges monthly — no client-side recurring logic needed
- Store `razorpay_subscription_id` in `vendor_subscriptions` table
- The existing webhook handles all renewals, cancellations, and expiry automatically

**Key change in payment handler:**
```
Old: create-payment → one-time order → verify-payment
New: create-vendor-subscription → Razorpay subscription → webhook handles renewals
```

### 3. Add Cancellation UI
**File:** `src/pages/VendorSettings.tsx`

Add to the Billing tab:
- "Cancel Subscription" button (only shown when subscription is active)
- Confirmation dialog explaining: "Benefits remain active until [expires_at]. No further charges."
- On confirm → call new `cancel-vendor-subscription` edge function

### 4. Create Cancel Subscription Edge Function
**File:** `supabase/functions/cancel-vendor-subscription/index.ts`

- Authenticate user, verify vendor ownership
- Call Razorpay API: `POST /v1/subscriptions/{sub_id}/cancel` with `cancel_at_cycle_end: true`
- Update `vendor_subscriptions.status` to `cancelled`, set `cancelled_at`
- The webhook will handle downgrading the vendor tier when the period actually ends

### 5. Update Webhook to Handle Promo/Discounted Amounts
**File:** `supabase/functions/vendor-subscription-webhook/index.ts` — No changes needed. Already handles all events correctly.

### 6. Update `create-vendor-subscription` to Support Promo Discounts
**File:** `supabase/functions/create-vendor-subscription/index.ts`

- Accept optional `promoCode` and `finalAmount` in request body
- When promo is applied, use Razorpay's `offer_id` or set a discounted first charge amount
- Since Razorpay Subscriptions don't natively support arbitrary promo discounts, use the `start_at` + first charge approach: create the subscription at full price but provide an `addons` negative adjustment, or simply create a Razorpay plan at the discounted price for the first billing cycle
- Simpler approach: For promo codes, create the subscription normally but apply a one-time addon credit. Or: create a one-time order for the first month at discounted price, then create the subscription starting next month.

**Practical approach:** Use Razorpay's subscription with `first_offer` — create a custom plan at the discounted amount for cycle 1, then switch to full price. Actually, simplest: just pass `total_count: 12` and handle first payment amount via the checkout `amount` override. Razorpay subscriptions support `first_min_amount` to charge a different amount for the first cycle.

### 7. Config Update
**File:** `supabase/config.toml`
- Add `[functions.cancel-vendor-subscription]` with `verify_jwt = true`

## Technical Flow

```text
Vendor selects plan → Enters promo code (optional)
  → Client calls create-vendor-subscription (with promo info)
  → Edge function creates Razorpay Plan + Subscription
  → Client opens Razorpay checkout with subscription_id
  → First payment captured → webhook: subscription.activated
  → Monthly: Razorpay auto-charges → webhook: subscription.charged
  → Vendor cancels → cancel-vendor-subscription → Razorpay cancels at cycle end
  → Webhook: subscription.cancelled → benefits until period end
  → Period ends → webhook: subscription.completed → downgrade to free
```

## Files Modified/Created
1. `src/lib/promoCodes.ts` — Add SUPER90
2. `src/components/vendor/VendorSubscriptionCheckout.tsx` — Switch to Razorpay Subscriptions API
3. `supabase/functions/create-vendor-subscription/index.ts` — Add promo code support
4. `supabase/functions/cancel-vendor-subscription/index.ts` — New: cancel subscription
5. `src/pages/VendorSettings.tsx` — Add cancellation UI with confirmation dialog
6. `supabase/config.toml` — Add cancel function config

