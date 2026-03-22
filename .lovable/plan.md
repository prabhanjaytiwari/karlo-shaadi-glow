# Karlo Shaadi — Complete Platform Audit & Competitive Differentiation Plan

## Market Intelligence Summary

### What Competitors Are Doing (and Failing At)


| Platform        | Strength                                                           | Weakness                                                                                                                          |
| --------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| **WedMeGood**   | Large vendor base, content/blog, brand recall                      | ₹25K-₹50K/year vendor plans, fake lead complaints, data breach (1.34M accounts), 1.0/5 on PissedConsumer, vendors report zero ROI |
| **WeddingWire** | International brand                                                | Fake lead generation exposed, high flat commissions, poor India localization                                                      |
| **Phera.io**    | Beautiful Indian wedding websites, WhatsApp concierge, smart RSVPs | No vendor marketplace — couples only. No discovery/booking                                                                        |
| **Wedd.ai**     | AI-first for wedding planners, guest management                    | Invite-only, no vendor marketplace, targets planners not couples                                                                  |


### What Vendors Hate (Opportunity for Karlo Shaadi)

1. **Expensive subscriptions** — WedMeGood charges ₹25K-₹50K/year, vendors report ZERO bookings
2. **Fake/junk leads** — Biggest complaint across all platforms
3. **High commissions** — 15-20% on bookings
4. **No transparency** — Vendors can't see analytics or lead quality
5. **No support** — Money taken, then ghosted

### What Couples Want (Missing Everywhere)

1. **Real prices upfront** — Not "contact for pricing"
2. **Multi-event planning** — Haldi, Mehendi, Sangeet, Wedding, Reception as separate bookable events
3. **Family collaboration** — Both sides manage guest lists, budgets
4. **WhatsApp-native communication** — Not email or in-app only
5. **Trusted verified vendors** — Not pay-to-rank listings

---

## Pricing Restructure

### Current Pricing (Too Expensive for New Platform)

- Free → Silver ₹4,999/mo → Gold ₹9,999/mo → Diamond ₹19,999/mo

### New Pricing (as requested)


| Tier        | Price     | Key Value                                                                      |
| ----------- | --------- | ------------------------------------------------------------------------------ |
| **Free**    | ₹0        | Basic listing, 5 photos, 10% commission                                        |
| **Starter** | ₹999/mo   | Enhanced visibility, 15 photos, 7% commission, Silver badge                    |
| **Pro**     | ₹2,999/mo | Top 5 placement, unlimited photos, 3% commission, Gold badge, analytics        |
| **Elite**   | ₹6,999/mo | Homepage featured, 0% commission, Diamond badge, dedicated support, custom URL |


### Changes Required

1. `**src/pages/VendorPricing.tsx**` — Update all 4 plan objects with new names, prices, features, badges
2. `**src/components/vendor/VendorSubscriptionCheckout.tsx**` — Update `PLAN_DETAILS` mapping with new prices and tier values
3. `**src/components/vendor/ToolGate.tsx**` — Update `PLAN_LABELS` with new pricing
4. `**src/pages/ForVendors.tsx**` — Update FAQ answer about pricing
5. `**src/components/CountdownBanner.tsx**` — Adjust discount logic for new prices
6. `**supabase/functions/create-vendor-subscription/index.ts**` — Update `SUBSCRIPTION_PLANS` amounts
7. **Database**: The `vendor_subscription_plan` enum currently has `free`, `featured`, `sponsored`. Need migration to add `starter`, `pro`, `elite` values (or remap existing ones).

---

## Platform Audit — Critical Fixes & Differentiators

### A. Trust & Credibility (Highest Priority)

1. **Real-time lead quality scoring visible to vendors** — Show vendors exactly how many profile views → inquiries → bookings they got. No other platform does this transparently.
2. **"Price Visible" mandate** — Every vendor must show at least a starting price. No more "Contact for pricing" — this is what couples hate most. Add a `starting_price` field enforcement on vendor profiles.
3. **Video testimonials from real vendors** — Add a section on ForVendors page with embedded video testimonials (can start with 1-2 early vendors).

### B. Unique Features Competitors Don't Have

4. **WhatsApp-First Inquiry** — Currently you have a WhatsApp button, but make it THE primary CTA. When a couple clicks "Inquire", send a pre-filled WhatsApp message with vendor name, couple's requirements, and a tracking link. This is how India works.
5. **"Karlo Shaadi Guarantee"** — If a vendor doesn't respond within 2 hours, auto-suggest 3 alternatives AND give the couple a ₹200 credit. No platform offers response-time guarantees.
6. **Vendor Video Portfolio** — Allow 30-second reel uploads (not just photos). Wedding vendors already make reels for Instagram — let them upload here too. This is a massive gap.
7. **Family Dashboard** — A shared space where bride's family and groom's family can collaborate on guest lists, budget splits, and vendor selections. Phera does websites but NOT collaborative planning.

### C. UI/UX Issues Found in Audit

8. **ForVendors page** — FAQ still says "Silver (₹4,999/year)" — inconsistent with monthly pricing shown elsewhere. Needs sync with new pricing.
9. **MobileHomeScreen** — Heavy with 50+ imports and 680+ lines. Performance concern. Should lazy-load sections below the fold.
10. **Vendor category counts are hardcoded** — ForVendors page shows "800+ Photographers", "600+ Caterers" etc. These should be real database counts or removed (violates your authentic trust stats policy).
11. **Index page SEO** claims "5,000+ verified vendors" — needs to match real data.

### D. Revenue & Growth Quick Wins

12. **Vendor Onboarding Simplification** — Currently the flow is: Register → Complete Profile → Wait for verification. Make it: Register with Google → Auto-create basic profile → Start getting visibility immediately. Verification adds a badge, not a gate.
13. **"Compare Vendors" feature prominence** — This exists but is buried. Make it a first-class feature on category pages with side-by-side comparison cards.
14. **Seasonal Pricing Alerts** — Alert couples when a vendor's prices are lower than usual (off-season). Alert vendors to raise prices during peak season. Data-driven, unique.

---

## Implementation Plan (Prioritized)

### Phase 1: Pricing Update (Immediate)

- Update all pricing references across 6-7 files
- Database migration for new plan enum values
- Update edge functions with new amounts

### Phase 2: Trust & Credibility (Week 1)

- Enforce starting price on vendor profiles
- Make WhatsApp the primary inquiry CTA
- Fix hardcoded vendor counts → real DB counts
- Fix ForVendors FAQ inconsistencies

### Phase 3: Differentiators (Week 2-3)

- Vendor video portfolio (30s reels)
- Response time guarantee system
- Family collaboration dashboard
- Vendor-facing lead quality transparency dashboard

### Phase 4: Performance & Polish (Ongoing)

- Lazy-load MobileHomeScreen sections
- Optimize vendor dashboard layout
- Add vendor onboarding email flow (already coded, needs domain verification)

---

## Technical Summary

### Files to Modify

- `src/pages/VendorPricing.tsx` — New tier names, prices, features
- `src/components/vendor/VendorSubscriptionCheckout.tsx` — New PLAN_DETAILS
- `src/components/vendor/ToolGate.tsx` — Updated plan labels
- `src/pages/ForVendors.tsx` — FAQ pricing fix
- `src/components/CountdownBanner.tsx` — Discount adjustments
- `supabase/functions/create-vendor-subscription/index.ts` — New amounts
- `supabase/functions/create-payment/index.ts` — Validate new plan names
- Database migration — Update enum or add new plan values

### New Features (Future Phases)

- Video portfolio upload component
- Family collaboration dashboard
- WhatsApp-first inquiry flow enhancement
- Response time guarantee logic

**Shall I start with Phase 1 (pricing update) first?**