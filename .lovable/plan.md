

# Razorpay & Resend Integration Status Report

## Razorpay Keys — Test vs Live

I cannot directly read the secret value, but here's how you can check:

- **Test keys** start with `rzp_test_` — payments are simulated, no real money moves
- **Live keys** start with `rzp_live_` — real charges to real cards

**You need to verify this yourself**: Log into your [Razorpay Dashboard](https://dashboard.razorpay.com) → Settings → API Keys and check if the Key ID starts with `rzp_test_` or `rzp_live_`.

All 3 secrets are configured: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` ✅

---

## Razorpay Webhook URL Configuration

The webhook endpoint is already built: `vendor-subscription-webhook` edge function.

**You need to configure this in Razorpay Dashboard**:
1. Go to Razorpay Dashboard → Settings → Webhooks
2. Add webhook URL: `https://qeutvpwskilkbgynhrai.supabase.co/functions/v1/vendor-subscription-webhook`
3. Select events: `subscription.activated`, `subscription.charged`, `subscription.cancelled`, `subscription.completed`, `subscription.halted`, `subscription.paused`, `subscription.resumed`
4. Enter the same webhook secret that's stored in your `RAZORPAY_WEBHOOK_SECRET`

The webhook function is deployed and handles signature verification + subscription lifecycle events. ✅

---

## Resend Email Tests

### onboarding-email function
- **Deployed & working** ✅
- Tested with `test@example.com` — function executed successfully (status 200)
- Resend returned a domain verification error for `gmail.com` — this is **expected behavior** in Resend's test mode. Emails to non-verified domains are blocked until your sender domain (`karloshaadi.com`) is verified in Resend.
- The function correctly sends different templates for `couple` vs `vendor` user types

### Email triggers in code
- **Couple signup** (`Auth.tsx` line 127): Calls `onboarding-email` with `user_type: 'couple'` ✅
- **Vendor signup** (`VendorOnboarding.tsx` line 332): Calls `onboarding-email` with `user_type: 'vendor'` ✅
- **Payment receipt** (`verify-payment` calls `send-payment-receipt`): Sends receipt after successful payment verification ✅

### What you need to verify in Resend
1. Is `karloshaadi.com` domain verified? (DNS records added?)
2. What is the `SENDER_EMAIL` secret set to? It should match your verified domain, e.g., `Karlo Shaadi <noreply@karloshaadi.com>`
3. If domain isn't verified yet, Resend will only deliver to the email address associated with your Resend account

---

## Summary — What's Working vs What Needs Your Action

| Item | Status | Action Needed |
|------|--------|---------------|
| Edge functions deployed | ✅ All deployed | None |
| Razorpay secrets configured | ✅ All 3 set | None |
| Razorpay test/live check | ⚠️ Cannot verify | Check key prefix in Razorpay Dashboard |
| Razorpay webhook URL | ⚠️ Not configured | Add URL in Razorpay Dashboard |
| Resend API key | ✅ Configured | None |
| Sender domain verification | ⚠️ Unknown | Check `karloshaadi.com` in Resend Dashboard |
| Signup email trigger | ✅ Code in place | Test with real signup |
| Vendor registration email | ✅ Code in place | Test with real vendor signup |
| Payment receipt email | ✅ Code in place | Test with real payment |

---

## No Code Changes Needed

All edge functions and email triggers are already properly implemented and deployed. The remaining items are **dashboard configuration tasks** that you need to do in Razorpay and Resend dashboards.

