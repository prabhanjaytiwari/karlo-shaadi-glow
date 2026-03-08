

## Mobile UX Optimization — Remaining Pages

After auditing all 87 pages, I found **19 pages** that lack proper mobile optimization. They're missing one or more of: `MobilePageHeader`, mobile-conditional padding (`isMobile` checks), bottom nav clearance (`pb-24`), or have hardcoded `pt-24`/`pt-32` that pushes content below the hidden desktop header on mobile.

### Pages Needing Fixes

| # | Page | Issues |
|---|------|--------|
| 1 | `Shipping.tsx` | Still imports `BhindiHeader` manually, no `MobilePageHeader`, no `isMobile`, no `pb-24` |
| 2 | `CancellationRefunds.tsx` | Has `MobilePageHeader` but hardcoded `pt-24` — content hidden under header on mobile, no `pb-24` |
| 3 | `Investors.tsx` | Has `MobilePageHeader` + `isMobile` but `<main>` uses hardcoded `py-20` regardless of mobile, no `pb-24` |
| 4 | `Blog.tsx` | Has `MobilePageHeader` but hero section uses `pt-32` unconditionally — overlaps on mobile, no `pb-24` |
| 5 | `Testimonials.tsx` | Same as Blog — `pt-32` hero unconditionally, no `pb-24` |
| 6 | `HelpCenter.tsx` | Same — `pt-32` hero, no `pb-24` |
| 7 | `Referrals.tsx` | No `MobilePageHeader`, hardcoded `pt-24`, no `pb-24` |
| 8 | `VendorBilling.tsx` | No `MobilePageHeader`, hardcoded `pt-24`, no `pb-24` |
| 9 | `VendorSettings.tsx` | No `MobilePageHeader`, hardcoded `pt-24`, no `pb-24` |
| 10 | `VendorOnboarding.tsx` | No `MobilePageHeader`, no mobile padding, `py-12` only |
| 11 | `VendorProfileSetup.tsx` | No `MobilePageHeader`, no mobile padding adaptation |
| 12 | `Checkout.tsx` | No `MobilePageHeader`, hardcoded `py-12`, no `pb-24` |
| 13 | `BookingConfirmation.tsx` | No `MobilePageHeader`, no mobile padding |
| 14 | `BookingDetails.tsx` | No `MobilePageHeader`, hardcoded `py-12`, no `pb-24` |
| 15 | `PaymentSuccess.tsx` | No `MobilePageHeader`, hardcoded `py-12`, no `pb-24` |
| 16 | `PaymentFailure.tsx` | No `MobilePageHeader`, uses `pt-20 md:pt-24` but no bottom clearance |
| 17 | `PremiumDashboard.tsx` | No `MobilePageHeader`, no mobile padding |
| 18 | `Legal.tsx` | Has `MobilePageHeader` + `isMobile` but header text (`text-4xl`) and `px-6` container too large on mobile, no `pb-24` |
| 19 | `Privacy.tsx` | Same as Legal — oversized header, no `pb-24` |

### Pattern for Each Fix

Every page gets the same treatment:
1. **Import** `MobilePageHeader` and `useIsMobile` (if not already)
2. **Add** `<MobilePageHeader title="..." />` at top of render
3. **Conditional padding**: `className={isMobile ? "px-4 py-4 pb-24" : "pt-24 pb-16"}`
4. **Scale down** heading sizes on mobile: `text-2xl` instead of `text-4xl`/`text-5xl`
5. **Remove** any manual `BhindiHeader` imports (Shipping.tsx)
6. For pages with hero sections (Blog, Testimonials, HelpCenter): use `isMobile ? 'pt-4 pb-8' : 'pt-32 pb-16'`

### Files to Change

All 19 files listed above. Each is a straightforward mechanical update — add imports, wrap main in mobile-conditional classes, scale typography, add `pb-24` for bottom nav clearance.

