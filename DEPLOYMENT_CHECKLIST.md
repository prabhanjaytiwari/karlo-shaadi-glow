# Wedding Platform Monetization - Deployment Checklist

## Pre-Deployment Checklist

### 1. Payment Gateway Configuration

#### Razorpay Setup
- [ ] Create Razorpay account (https://razorpay.com)
- [ ] Complete KYC verification
- [ ] Activate payment gateway
- [ ] Get API credentials (Key ID & Secret)
- [ ] Add credentials to Lovable secrets:
  - `RAZORPAY_KEY_ID`
  - `RAZORPAY_KEY_SECRET`
  - `RAZORPAY_WEBHOOK_SECRET`
- [ ] Configure webhook URL in Razorpay dashboard
  - URL: `https://[your-project].supabase.co/functions/v1/vendor-subscription-webhook`
  - Events: All subscription and payment events
- [ ] Test in test mode with test cards
- [ ] Switch to live mode before production

#### Webhook Configuration
```
Webhook URL: https://qeutvpwskilkbgynhrai.supabase.co/functions/v1/vendor-subscription-webhook
Events to Enable:
- payment.authorized
- payment.captured
- payment.failed
- subscription.activated
- subscription.charged
- subscription.completed
- subscription.cancelled
- subscription.paused
- subscription.resumed
```

### 2. Database Setup

#### Required Tables (Already Created)
- [x] subscriptions
- [x] vendor_subscriptions
- [x] payments
- [x] bookings
- [x] vendors
- [x] vendor_services
- [x] analytics_events

#### Security Checks
- [ ] Run `supabase linter` to check for security issues
- [ ] Verify RLS policies are enabled on all tables
- [ ] Test RLS policies with different user roles
- [ ] Ensure no sensitive data is exposed without authentication

### 3. Edge Functions Deployment

#### Functions to Deploy (Auto-deployed)
- [x] create-payment
- [x] verify-payment
- [x] create-vendor-subscription
- [x] manage-vendor-tier
- [x] vendor-subscription-webhook
- [x] ai-wedding-planner
- [x] track-event

#### Function Testing
- [ ] Test create-payment with valid/invalid inputs
- [ ] Test verify-payment with mock signatures
- [ ] Test vendor subscription creation
- [ ] Test webhook handling with Razorpay test events
- [ ] Test AI wedding planner responses
- [ ] Verify analytics tracking

### 4. Lovable AI Configuration

- [x] Lovable AI enabled
- [x] `LOVABLE_API_KEY` configured (auto-generated)
- [ ] Test AI chat functionality
- [ ] Monitor AI usage and costs
- [ ] Set up rate limits if needed

### 5. Pricing Configuration

#### User Pricing
- **Free Plan**: ₹0 (All features)
- **AI Premium**: ₹999/month
  - Features: AI Planner, 2 consultations/month, 5% discounts

#### Vendor Pricing
- **Free**: ₹0 (Basic listing)
- **Featured**: ₹4,999/month (Priority in search, 2% fee)
- **Sponsored**: ₹9,999/month (Homepage featured, 0% fee)

### 6. Testing Checklist

#### Payment Flows
- [ ] Test booking payment flow (advance + balance)
- [ ] Test AI Premium subscription payment
- [ ] Test vendor Featured upgrade
- [ ] Test vendor Sponsored upgrade
- [ ] Test payment failure handling
- [ ] Test payment verification
- [ ] Test webhook processing

#### User Journeys
- [ ] Couple signup → Browse → Book → Pay
- [ ] Couple upgrade to AI Premium
- [ ] AI chat functionality for premium users
- [ ] Vendor signup → Create services → Get bookings
- [ ] Vendor upgrade to Featured/Sponsored
- [ ] Admin dashboard access and vendor verification

#### Analytics
- [ ] Verify event tracking fires correctly
- [ ] Check analytics dashboard displays data
- [ ] Test revenue calculations
- [ ] Verify vendor performance metrics

### 7. Security Testing

#### Authentication & Authorization
- [ ] Test protected routes redirect to login
- [ ] Test role-based access (admin, vendor, couple)
- [ ] Verify users can only access their own data
- [ ] Test AI Premium subscription checks
- [ ] Test vendor tier permission checks

#### Payment Security
- [ ] Verify payment signature validation
- [ ] Test rate limiting on payment endpoints
- [ ] Ensure webhook signature verification
- [ ] Test for SQL injection vulnerabilities
- [ ] Verify no sensitive data in client logs

#### RLS Policies
- [ ] Users can only view their own bookings
- [ ] Vendors can only view their own bookings
- [ ] Admins can view all data
- [ ] AI Premium features gated properly
- [ ] Vendor tier features gated properly

### 8. Performance Optimization

- [ ] Enable database indexes on frequently queried columns
- [ ] Implement pagination for large lists
- [ ] Optimize vendor search queries
- [ ] Add caching where appropriate
- [ ] Compress and optimize images
- [ ] Lazy load components and routes

### 9. Error Handling

- [ ] All edge functions have proper error handling
- [ ] User-friendly error messages displayed
- [ ] Failed payments redirect correctly
- [ ] Network errors handled gracefully
- [ ] Rate limit errors show helpful messages

### 10. Monitoring & Logging

- [ ] Set up error tracking (e.g., Sentry)
- [ ] Monitor edge function logs
- [ ] Track payment success/failure rates
- [ ] Monitor AI usage and costs
- [ ] Set up alerts for critical errors

### 11. Legal & Compliance

- [ ] Terms of Service page complete
- [ ] Privacy Policy updated
- [ ] Cancellation & Refund Policy clear
- [ ] Payment terms clearly stated
- [ ] GDPR compliance (if applicable)
- [ ] Data export functionality working

### 12. Documentation

- [ ] Admin guide for managing platform
- [ ] Vendor onboarding guide
- [ ] Payment testing guide (test cards)
- [ ] Troubleshooting common issues
- [ ] API documentation (if exposing APIs)

## Post-Deployment Checklist

### Day 1
- [ ] Monitor payment processing
- [ ] Check webhook delivery success rate
- [ ] Monitor edge function errors
- [ ] Track user signups and conversions
- [ ] Be available for support

### Week 1
- [ ] Review analytics data
- [ ] Check for recurring errors
- [ ] Monitor subscription renewals
- [ ] Gather user feedback
- [ ] Optimize based on real usage

### Month 1
- [ ] Review revenue metrics
- [ ] Analyze conversion funnels
- [ ] Identify and fix bottlenecks
- [ ] Plan feature improvements
- [ ] Scale infrastructure if needed

## Emergency Contacts

- **Razorpay Support**: support@razorpay.com
- **Lovable Support**: support@lovable.dev
- **Supabase Support**: support@supabase.com

## Rollback Plan

If critical issues arise:

1. **Disable Payments**: Comment out payment buttons in frontend
2. **Pause Webhooks**: Disable webhook in Razorpay dashboard
3. **Revert Code**: Use Lovable history to restore previous version
4. **Notify Users**: Add banner about temporary issues
5. **Fix & Redeploy**: Address issues and redeploy

## Test Card Details (Razorpay Test Mode)

**Success Card**:
- Card: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date

**Failure Card**:
- Card: 4000 0000 0000 0002

**3DS Authentication**:
- Card: 4000 0027 6000 3184
- OTP: 0007

**Test UPI**:
- Success: success@razorpay
- Failure: failure@razorpay

## Support Resources

- [Razorpay Docs](https://razorpay.com/docs/)
- [Lovable Docs](https://docs.lovable.dev/)
- [Supabase Docs](https://supabase.com/docs)
