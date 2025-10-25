# Security Guidelines

## Overview

This document outlines the security measures implemented in the Wedding Platform monetization system.

## Payment Security

### 1. Payment Signature Verification

All Razorpay payments are verified using signature validation:

```typescript
// In verify-payment edge function
const generatedSignature = createHmac('sha256', razorpayKeySecret)
  .update(orderId + "|" + paymentId)
  .digest('hex');

if (generatedSignature !== signature) {
  throw new Error("Invalid payment signature");
}
```

**Security Benefits:**
- Prevents payment tampering
- Ensures payment authenticity
- Protects against replay attacks

### 2. Webhook Signature Verification

All webhooks are verified before processing:

```typescript
// In vendor-subscription-webhook
const expectedSignature = createHmac('sha256', webhookSecret)
  .update(JSON.stringify(body))
  .digest('hex');

if (receivedSignature !== expectedSignature) {
  return new Response("Invalid signature", { status: 401 });
}
```

**Security Benefits:**
- Prevents malicious webhook calls
- Ensures webhook authenticity
- Protects sensitive operations

### 3. Rate Limiting

Payment endpoints have rate limiting:

```typescript
// Max 5 payment attempts per minute per user
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_ATTEMPTS = 5;
```

**Protected Against:**
- Brute force attacks
- DDoS attempts
- Payment spam
- Resource exhaustion

### 4. Amount Validation

**Server-side validation ensures:**
- Amounts are positive numbers
- No decimal manipulation
- Currency is correct (INR)
- Amount matches booking/subscription

**Client-side amounts are never trusted.**

## Authentication & Authorization

### 1. JWT Token Verification

All edge functions verify JWT tokens:

```typescript
const { data: { user }, error } = await supabase.auth.getUser(
  authHeader.replace("Bearer ", "")
);

if (error || !user) {
  throw new Error("Unauthorized");
}
```

### 2. Row Level Security (RLS)

**All sensitive tables have RLS enabled:**

```sql
-- Users can only view their own bookings
CREATE POLICY "Users can view their own bookings"
ON bookings FOR SELECT
USING (auth.uid() = couple_id);

-- Vendors can only modify their own data
CREATE POLICY "Vendors can update their own profile"
ON vendors FOR UPDATE
USING (auth.uid() = user_id);
```

**Tables with RLS:**
- ✅ bookings
- ✅ payments
- ✅ subscriptions
- ✅ vendor_subscriptions
- ✅ messages
- ✅ favorites
- ✅ reviews
- ✅ vendor_services
- ✅ vendor_portfolio

### 3. Role-Based Access Control

Roles are stored separately and checked securely:

```sql
-- Security definer function prevents RLS recursion
CREATE FUNCTION has_role(_user_id uuid, _role app_role)
RETURNS boolean
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;
```

**Roles:**
- `couple` - Can book vendors, subscribe
- `vendor` - Can manage services, receive bookings
- `admin` - Can verify vendors, view analytics

## Data Protection

### 1. Sensitive Data Handling

**Never stored in client:**
- Payment credentials
- API keys
- Webhook secrets
- User passwords (handled by Supabase Auth)

**Encrypted at rest:**
- Razorpay credentials (Supabase secrets)
- User authentication tokens
- Payment transaction details

### 2. PII Protection

**Personal Identifiable Information:**
- Names, emails, phone numbers protected by RLS
- Only accessible by data owner and admins
- Not exposed in public APIs
- GDPR-compliant data export available

### 3. SQL Injection Prevention

**All queries use parameterized queries:**

```typescript
// ✅ SAFE - Using Supabase query builder
const { data } = await supabase
  .from('vendors')
  .select('*')
  .eq('id', vendorId);

// ❌ NEVER DO - Raw SQL with user input
// const query = `SELECT * FROM vendors WHERE id = '${vendorId}'`;
```

## Edge Function Security

### 1. Environment Variables

**Never hardcoded:**
- API keys stored in Supabase secrets
- Accessed via `Deno.env.get()`
- Not exposed to client

### 2. CORS Configuration

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
```

**Considerations:**
- Allows all origins for public APIs
- Requires authentication for sensitive operations
- OPTIONS requests handled separately

### 3. Input Validation

**All user inputs validated:**

```typescript
// Validate booking data
if (!bookingId || !amount || amount <= 0) {
  throw new Error("Invalid input");
}

// Validate subscription plan
if (!['ai_premium'].includes(subscriptionPlan)) {
  throw new Error("Invalid subscription plan");
}
```

## Logging & Monitoring

### 1. Security Event Logging

**Logged events:**
- Failed authentication attempts
- Payment failures
- Invalid webhook signatures
- Rate limit violations
- Unauthorized access attempts

### 2. Audit Trail

**Tracked in analytics_events:**
- Payment initiations
- Subscription changes
- Vendor tier upgrades
- Admin actions

### 3. Error Handling

**Security-safe error messages:**

```typescript
// ❌ DON'T expose internal errors
throw new Error("Database connection failed: " + dbError);

// ✅ DO provide generic messages
throw new Error("Unable to process request. Please try again.");
```

**Detailed errors logged server-side only.**

## Common Attack Vectors & Mitigations

### 1. Payment Manipulation

**Attack:** User modifies amount before payment
**Mitigation:** Server validates amount against booking/subscription

### 2. Replay Attacks

**Attack:** Reusing captured payment signatures
**Mitigation:** Signatures are one-time use, order IDs are unique

### 3. Webhook Spoofing

**Attack:** Fake webhook calls to activate subscriptions
**Mitigation:** Signature verification + source IP validation

### 4. Privilege Escalation

**Attack:** Regular user tries to access admin functions
**Mitigation:** Role checks + RLS policies + JWT verification

### 5. SQL Injection

**Attack:** Malicious SQL in user inputs
**Mitigation:** Parameterized queries only, no raw SQL

### 6. XSS (Cross-Site Scripting)

**Attack:** Injecting malicious scripts
**Mitigation:** React auto-escapes, Content Security Policy

### 7. CSRF (Cross-Site Request Forgery)

**Attack:** Unauthorized actions on behalf of user
**Mitigation:** JWT tokens, SameSite cookies, CORS

### 8. Brute Force

**Attack:** Repeated payment/login attempts
**Mitigation:** Rate limiting, exponential backoff

## Security Checklist

### Pre-Production
- [ ] All secrets stored in Supabase (not in code)
- [ ] RLS enabled on all sensitive tables
- [ ] Role-based access implemented
- [ ] Payment signature verification working
- [ ] Webhook signature verification working
- [ ] Rate limiting configured
- [ ] Input validation on all endpoints
- [ ] Error messages don't expose internals
- [ ] HTTPS enforced (automatic with Lovable)
- [ ] SQL injection tests passed
- [ ] Authentication tests passed

### Production
- [ ] Monitor failed authentication attempts
- [ ] Alert on payment failures spike
- [ ] Review webhook logs regularly
- [ ] Audit admin actions
- [ ] Regular security reviews
- [ ] Keep dependencies updated
- [ ] Review RLS policies periodically

## Incident Response

### Payment Fraud Detected

1. **Immediate Actions:**
   - Suspend affected accounts
   - Block suspicious IP addresses
   - Notify Razorpay
   - Preserve logs

2. **Investigation:**
   - Review payment records
   - Check webhook logs
   - Analyze access patterns
   - Identify vulnerabilities

3. **Remediation:**
   - Patch vulnerabilities
   - Implement additional checks
   - Update security policies
   - Notify affected users

### Data Breach

1. **Immediate Actions:**
   - Identify scope of breach
   - Secure compromised systems
   - Notify relevant parties
   - Preserve evidence

2. **Assessment:**
   - Determine what data was accessed
   - Identify attack vector
   - Assess impact

3. **Response:**
   - Mandatory notifications (GDPR if applicable)
   - Password resets for affected users
   - Implement additional security measures
   - Public disclosure if required

## Security Contacts

**Report Security Issues:**
- Email: security@yourdomain.com
- Emergency: [Your emergency contact]

**External Resources:**
- Razorpay Security: security@razorpay.com
- Supabase Security: security@supabase.io

## Regular Security Tasks

### Daily
- Monitor failed login attempts
- Check payment failure rates
- Review error logs

### Weekly
- Review new user signups
- Audit admin actions
- Check for suspicious patterns

### Monthly
- Security dependencies update
- RLS policy review
- Access control audit
- Penetration testing

### Quarterly
- Full security audit
- Disaster recovery drill
- Update security documentation
- Team security training

## Compliance

### GDPR (if applicable)
- ✅ Data export functionality
- ✅ Right to be forgotten capability
- ✅ Privacy policy in place
- ✅ Data processing agreements
- ✅ Consent mechanisms

### PCI DSS
- ✅ No card data stored
- ✅ Using PCI-compliant gateway (Razorpay)
- ✅ Secure transmission (HTTPS)
- ✅ Access controls in place

## Best Practices

1. **Never trust client-side data**
2. **Always validate inputs server-side**
3. **Use parameterized queries only**
4. **Implement rate limiting**
5. **Log security events**
6. **Keep secrets secret**
7. **Verify signatures**
8. **Test RLS policies**
9. **Monitor suspicious activity**
10. **Have an incident response plan**
