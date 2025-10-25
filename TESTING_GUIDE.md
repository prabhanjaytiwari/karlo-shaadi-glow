# Payment Testing Guide

## Overview

This guide covers testing all payment and monetization features of the Wedding Platform.

## Test Accounts Setup

### 1. Admin Account
```
Email: admin@example.com
Role: admin
Access: Full platform access, analytics, testing panel
```

### 2. Vendor Account
```
Email: vendor@example.com
Role: vendor
Access: Vendor dashboard, can upgrade tiers
```

### 3. Couple Account
```
Email: couple@example.com
Role: couple
Access: Browse vendors, make bookings, subscribe to AI Premium
```

## Testing Razorpay Payments

### Test Cards (Test Mode Only)

#### Success Card
```
Card Number: 4111 1111 1111 1111
CVV: Any 3 digits (e.g., 123)
Expiry: Any future date (e.g., 12/25)
Name: Any name
```

#### Failure Card (Payment Declined)
```
Card Number: 4000 0000 0000 0002
CVV: Any 3 digits
Expiry: Any future date
```

#### 3DS Authentication Required
```
Card Number: 4000 0027 6000 3184
CVV: Any 3 digits
Expiry: Any future date
OTP: 0007 (when prompted)
```

### Test UPI IDs

#### Success UPI
```
UPI ID: success@razorpay
```

#### Failure UPI
```
UPI ID: failure@razorpay
```

### Test Net Banking
```
Bank: Any test bank
Username: test
Password: test
```

## Payment Flow Testing

### 1. Booking Payment Flow

**Steps:**
1. Login as couple
2. Browse vendors and select one
3. Click "Book Now"
4. Fill booking details (wedding date, requirements)
5. Submit booking
6. Navigate to checkout
7. Use test card to pay advance (30%)
8. Verify payment success
9. Check booking status changes to "confirmed"
10. Verify payment record created
11. Verify notification sent

**Expected Results:**
- Booking status: `pending` → `confirmed`
- Payment status: `pending` → `paid`
- Analytics event: `payment_completed`
- Email notification sent to couple and vendor

### 2. AI Premium Subscription

**Steps:**
1. Login as couple
2. Navigate to /pricing
3. Click "Start AI Planning" on AI Premium
4. Fill payment details with test card
5. Complete payment
6. Verify redirect to /premium-dashboard
7. Test AI chat functionality
8. Check subscription status in database

**Expected Results:**
- Subscription created with status `active`
- User gains access to premium dashboard
- AI chat works for the user
- Analytics event: `subscription_started`

### 3. Vendor Featured Upgrade

**Steps:**
1. Login as vendor
2. Navigate to vendor dashboard
3. Click "Upgrade to Featured"
4. Complete payment with test card
5. Verify vendor tier changes to `featured`
6. Check vendor appears higher in search
7. Verify badge shows on profile

**Expected Results:**
- Vendor subscription status: `active`
- Vendor tier: `free` → `featured`
- Search ranking improved
- Badge displayed on profile
- 2% transaction fee applied

### 4. Vendor Sponsored Upgrade

**Steps:**
1. Login as vendor
2. Navigate to vendor dashboard
3. Click "Upgrade to Sponsored"
4. Complete payment with test card
5. Verify vendor tier changes to `sponsored`
6. Check vendor appears on homepage carousel
7. Verify 0% transaction fee

**Expected Results:**
- Vendor subscription status: `active`
- Vendor tier: `featured` → `sponsored`
- Appears in homepage featured carousel
- No transaction fees (0%)
- Crown badge on profile

## Testing Payment Failures

### 1. Declined Card
**Test with:** 4000 0000 0000 0002
**Expected:** Error message, redirect to failure page, no charge

### 2. Insufficient Funds
**Test with:** 4000 0000 0000 9995
**Expected:** Payment fails, user notified, can retry

### 3. Network Issues
**Test:** Disconnect internet during payment
**Expected:** Graceful error handling, ability to retry

### 4. Webhook Failures
**Test:** Temporarily disable webhook
**Expected:** Payment still processed, manual reconciliation possible

## Testing Webhook Processing

### 1. Access Webhook Logs
```bash
# Navigate to Supabase Dashboard
# Go to Edge Functions → vendor-subscription-webhook
# View logs for webhook events
```

### 2. Test Events

#### Subscription Activated
```json
{
  "event": "subscription.activated",
  "payload": {
    "subscription": {
      "entity": {
        "id": "sub_test123",
        "status": "active",
        "plan_id": "plan_featured"
      }
    }
  }
}
```

#### Subscription Charged
```json
{
  "event": "subscription.charged",
  "payload": {
    "payment": {
      "entity": {
        "id": "pay_test123",
        "status": "captured",
        "amount": 499900
      }
    }
  }
}
```

## Testing Analytics Tracking

### 1. Admin Testing Panel
1. Login as admin
2. Navigate to Admin Dashboard → Testing tab
3. Use "Track Test Event" button
4. Verify event appears in analytics

### 2. Verify Analytics Events

**Check these events fire correctly:**
- `vendor_view` - When viewing vendor profile
- `booking_created` - When booking is created
- `payment_initiated` - When payment starts
- `payment_completed` - When payment succeeds
- `payment_failed` - When payment fails
- `subscription_started` - When subscription begins
- `favorite_added` - When vendor favorited
- `ai_chat_message` - When AI message sent

### 3. Analytics Dashboard
1. Navigate to Admin → Analytics
2. Select time range (7d/30d/90d)
3. Verify metrics display:
   - Total revenue
   - Total bookings
   - Active users
   - Active vendors
   - Top vendors
   - Platform activity

## Testing Security

### 1. RLS Policies
**Test:**
- User A cannot see User B's bookings
- User A cannot see User B's messages
- Vendor A cannot modify Vendor B's services
- Non-admin cannot access admin dashboard

### 2. Payment Security
**Test:**
- Invalid signature rejected
- Expired orders rejected
- Rate limits enforced (5 attempts/minute)
- Amount manipulation prevented

### 3. Role-Based Access
**Test:**
- Couple cannot access vendor dashboard
- Vendor cannot access admin panel
- Guest redirected to login
- AI Premium features gated

## Performance Testing

### 1. Load Testing
**Test:**
- 100 concurrent vendor searches
- 50 concurrent payment processing
- Heavy analytics dashboard usage
- Simultaneous webhook processing

### 2. Response Times
**Target:**
- Page load: < 2s
- Search results: < 1s
- Payment initiation: < 3s
- Payment verification: < 5s
- AI response: < 10s

## Edge Cases

### 1. Double Payment Prevention
**Test:** Rapid-fire submit button clicks
**Expected:** Only one payment created

### 2. Stale Data Handling
**Test:** Payment in one tab, refresh in another
**Expected:** Consistent state across tabs

### 3. Webhook Replay Attack
**Test:** Resend same webhook twice
**Expected:** Idempotent processing

### 4. Partial Payment Failure
**Test:** Payment captured but webhook fails
**Expected:** Manual reconciliation possible

## Debugging Tips

### Check Edge Function Logs
```
Supabase Dashboard → Edge Functions → [function-name] → Logs
```

### Check Database Records
```sql
-- Check recent payments
SELECT * FROM payments ORDER BY created_at DESC LIMIT 10;

-- Check subscriptions
SELECT * FROM subscriptions WHERE status = 'active';

-- Check vendor subscriptions
SELECT * FROM vendor_subscriptions WHERE status = 'active';

-- Check analytics events
SELECT event_type, COUNT(*) 
FROM analytics_events 
GROUP BY event_type 
ORDER BY COUNT(*) DESC;
```

### Check Razorpay Dashboard
- Payments → Recent payments
- Subscriptions → Active subscriptions
- Webhooks → Webhook logs
- Events → All events

## Common Issues & Solutions

### Issue: Payment succeeds but booking not confirmed
**Solution:** Check webhook delivery, manually verify payment

### Issue: Webhook signature mismatch
**Solution:** Verify RAZORPAY_WEBHOOK_SECRET is correct

### Issue: AI Premium not activating
**Solution:** Check subscription table, verify verify-payment function

### Issue: Analytics not tracking
**Solution:** Check track-event edge function logs

### Issue: Search not showing upgraded vendors
**Solution:** Verify vendor tier in database, check ranking algorithm

## Test Checklist

- [ ] Couple signup and login
- [ ] Vendor signup and onboarding
- [ ] Search and filter vendors
- [ ] Create booking
- [ ] Pay booking advance
- [ ] Pay booking balance
- [ ] Subscribe to AI Premium
- [ ] Use AI chat
- [ ] Upgrade vendor to Featured
- [ ] Upgrade vendor to Sponsored
- [ ] Test payment failures
- [ ] Verify webhooks processing
- [ ] Check analytics tracking
- [ ] Test admin dashboard
- [ ] Verify RLS policies
- [ ] Test on mobile devices
- [ ] Test in different browsers

## Production Checklist

Before going live:
- [ ] Switch Razorpay to Live mode
- [ ] Update webhook URL to production
- [ ] Test with real small amounts
- [ ] Monitor first few transactions closely
- [ ] Have rollback plan ready
- [ ] Support team briefed
- [ ] Documentation complete
