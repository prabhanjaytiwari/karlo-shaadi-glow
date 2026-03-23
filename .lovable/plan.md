

# Harden Razorpay Subscription System — Complete Plan

## What's Missing Today

1. **No payment logging table** — zero audit trail for payment attempts, failures, or webhook events
2. **No admin recovery UI** — if a payment succeeds on Razorpay but fails in our DB, there's no way to fix it without raw SQL
3. **No fallback verification** — if the webhook misses an event, no background job or manual check re-syncs from Razorpay API
4. **Webhook is correct** but lacks event logging and idempotency guards (duplicate webhook calls could corrupt data)
5. **Client-side success state** is minimal — no persistent "Your plan is active" confirmation after payment

---

## Changes

### 1. Create `payment_logs` Table (Migration)

Stores every payment-related event as an immutable audit trail:

```sql
CREATE TABLE public.payment_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid,
  user_id uuid,
  event_type text NOT NULL,          -- 'checkout_initiated', 'razorpay_callback', 'webhook_received', 'verification_failed', 'manual_recovery', etc.
  razorpay_payment_id text,
  razorpay_subscription_id text,
  razorpay_order_id text,
  plan text,
  amount numeric,
  status text,                        -- 'success', 'failed', 'pending'
  error_message text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- RLS: Admins can read all, vendors can read own
ALTER TABLE public.payment_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all payment logs" ON public.payment_logs
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Vendors can view own payment logs" ON public.payment_logs
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can insert payment logs" ON public.payment_logs
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Service role needs full access for edge functions
CREATE POLICY "Service role full access" ON public.payment_logs
  FOR ALL USING (true);
```

### 2. Harden Webhook — Idempotency + Logging

**File:** `supabase/functions/vendor-subscription-webhook/index.ts`

Add:
- **Idempotency**: Before processing, check if this exact `razorpay_payment_id` (for charged events) or event combination already exists in `payment_logs`. Skip if duplicate.
- **Event logging**: Insert a `payment_logs` row for every webhook event received (success or failure).
- **Error resilience**: Wrap each DB update in try/catch — if vendor_subscriptions update fails, still log the event and return 200 (so Razorpay doesn't retry endlessly).

### 3. Add Razorpay API Fallback Verification

**File:** `supabase/functions/verify-vendor-subscription/index.ts` (NEW)

A new edge function that an admin (or the system) can call to:
1. Accept a `razorpay_subscription_id` or `vendor_id`
2. Fetch the subscription status directly from Razorpay API (`GET /v1/subscriptions/{id}`)
3. Compare with local `vendor_subscriptions` table
4. If Razorpay says "active" but local says "created"/"free", fix the local DB
5. Log the recovery action in `payment_logs`

### 4. Admin Subscription Recovery Panel

**File:** `src/components/admin/SubscriptionRecoveryPanel.tsx` (NEW)

A new admin tab component with:
- Search by vendor email, business name, or vendor ID
- Shows vendor's current subscription status (local DB) alongside Razorpay status (fetched via edge function)
- "Sync from Razorpay" button — calls `verify-vendor-subscription` to auto-fix mismatches
- "Manual Activate" form — admin enters plan + payment ID → directly upserts `vendor_subscriptions` + updates `vendors.subscription_tier`
- Payment logs table filtered by vendor — shows all events for debugging

**File:** `src/pages/AdminDashboard.tsx`

- Add new tab "Subscriptions" with the `SubscriptionRecoveryPanel`

### 5. Client-Side Payment Trust Layer

**File:** `src/components/vendor/VendorSubscriptionCheckout.tsx`

Enhance the checkout flow:
- **Before payment**: Log `checkout_initiated` event to `payment_logs`
- **On Razorpay callback (success)**: Log `razorpay_callback` event, then write subscription data (existing logic)
- **On failure**: Log `payment_failed` event with error details. Show a clear error UI with:
  - "Payment failed" message
  - "Retry Payment" button
  - "Contact Support" link (WhatsApp/email)
  - Payment reference ID for support debugging
- **Post-success**: After successful write, show a persistent confirmation banner: "Your [Plan] subscription is active! ✓" with plan details and next billing date

### 6. Webhook Logging in `create-vendor-subscription`

**File:** `supabase/functions/create-vendor-subscription/index.ts`

Add `payment_logs` insert for `subscription_created` event after successful Razorpay subscription creation.

### 7. Webhook Logging in `cancel-vendor-subscription`

**File:** `supabase/functions/cancel-vendor-subscription/index.ts`

Add `payment_logs` insert for `subscription_cancelled` event.

---

## Files Created/Modified

| File | Action |
|------|--------|
| Migration: `payment_logs` table | **Create** |
| `supabase/functions/vendor-subscription-webhook/index.ts` | **Modify** — add idempotency, logging |
| `supabase/functions/verify-vendor-subscription/index.ts` | **Create** — Razorpay API fallback verification |
| `supabase/functions/create-vendor-subscription/index.ts` | **Modify** — add payment logging |
| `supabase/functions/cancel-vendor-subscription/index.ts` | **Modify** — add payment logging |
| `src/components/admin/SubscriptionRecoveryPanel.tsx` | **Create** — admin recovery UI |
| `src/pages/AdminDashboard.tsx` | **Modify** — add Subscriptions tab |
| `src/components/vendor/VendorSubscriptionCheckout.tsx` | **Modify** — add logging, better error/success states |
| `supabase/config.toml` | **Modify** — add verify-vendor-subscription config |

---

## Technical Flow After Changes

```text
Vendor clicks Subscribe
  → Log: checkout_initiated
  → create-vendor-subscription → Razorpay subscription created
  → Log: subscription_created
  → Razorpay checkout opens
  → Payment captured
  → Razorpay handler callback fires
  → Log: razorpay_callback
  → Client writes vendor_subscriptions (fallback)
  → Show "Plan Active ✓" confirmation
  
Meanwhile:
  → Razorpay webhook fires → vendor-subscription-webhook
  → Check idempotency (skip if duplicate)
  → Log: webhook_received
  → Update vendor_subscriptions + vendors table
  → Send notification

If webhook fails:
  → Client-side fallback already wrote the data
  → Admin can use "Sync from Razorpay" to verify
  → payment_logs shows full audit trail

If client-side fails:
  → Webhook will still fire and update correctly
  → Admin recovery panel can manually fix
```

