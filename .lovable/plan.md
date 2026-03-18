

# Comprehensive Bug Fix & UX Improvement Plan

## Overview
10 fixes + design cleanup across 12+ files. Some fixes from the previous round (ProtectedRoute, useAuth, VendorAuth) are already partially done — this plan builds on that and addresses all remaining items.

---

## FIX 1 — Vendor Auth Register Link
**File**: `src/pages/VendorAuth.tsx`
**Status**: Already has a register CTA (lines 253-262) from prior fix. Needs enhancement:
- Add note text at top of form: "Already registered? Login below. First time? Click register below."
- Change CTA text to "Naye vendor hain? Register karein →"
- Keep existing styling/placement

---

## FIX 2 — Mobile Homepage Stat Mismatch
**File**: `src/components/mobile/MobileHomeScreen.tsx` (lines 338-350)
- Change `'50+'` Vendors → `'5,000+'`
- Values should be: Couples `500+`, Vendors `5,000+`, Secure `100%`, Cities `20+`

---

## FIX 3 — Messages.tsx (4 bugs)

**3a — Conversation last message not updating on realtime INSERT**
In `setupRealtimeSubscription` (line 209-213), the realtime handler calls `loadConversations()` which is expensive. Instead, also update the local `conversations` state inline when a new message INSERT arrives — update `lastMessage` and `lastMessageTime` for the matching conversation.

**3b — Typing channel memory leak**
`handleTyping()` (lines 242-251) creates a new `supabase.channel()` on every keystroke. Fix: create a `typingChannelRef = useRef()` that's initialized once when `selectedVendor` changes, and reuse it in `handleTyping`.

**3c — Realtime subscription cleanup**
`setupRealtimeSubscription` returns a cleanup function (line 236-239) but the `useEffect` on line 53-58 never captures or calls it. Store the return value and call it on cleanup.

**3d — Unread count not zeroing after reading**
After `loadMessages` marks messages as read (lines 152-156), also update local `conversations` state to set `unreadCount = 0` for the selected vendor.

---

## FIX 4 — ProtectedRoute Double DB Calls
**File**: `src/components/ProtectedRoute.tsx`
**Status**: Already fixed in prior round — now uses `useAuthContext()`. Need to add `rolesLoading` check (see Fix 9).

---

## FIX 5 — Vendor Subscription Price Mismatch
**File**: `src/components/vendor/VendorSubscriptionCheckout.tsx` (lines 131-145)
- Change `amount: plan.price` → `amount: finalPrice` in the upsert
- Add `discount_amount` metadata — since column doesn't exist in `vendor_subscriptions`, store it in a notes/metadata approach or add a migration. Best approach: add a DB migration for `discount_amount numeric default 0` column, then include it in the upsert.
- Add idempotency check: before upsert, check if `razorpay_payment_id` already exists in vendor_subscriptions.

**DB Migration needed**: Add `discount_amount` column to `vendor_subscriptions`.

---

## FIX 6 — Dashboard Mobile Quick Actions
**File**: `src/pages/Dashboard.tsx` (lines 153-178)
- Replace horizontal scroll with 2x3 grid for top 6 actions on mobile
- Add "More →" button that navigates to a tools/more section
- Keep desktop layout unchanged (line 180-194)

---

## FIX 7 — Empty State Fallback for Vendor Search

**File**: `src/pages/Categories.tsx` (lines 95-129)
When `vendors.length === 0` after loading with a selected category, show Hindi empty state with email waitlist form that inserts into `contact_inquiries`.

**File**: `src/pages/CityVendors.tsx` (lines 206-226)
Already has an empty state but it's vendor-focused. Replace with couple-facing waitlist form using city name, email input, and toast confirmation.

---

## FIX 8 — Vendor Onboarding Fake Countdown
**File**: `src/components/CountdownBanner.tsx`
Currently uses `localStorage` start time (resets on clear). Replace with end-of-current-month countdown:
- `getTimeLeft()`: calculate ms from now to last day of current month at 23:59:59
- Remove `STORAGE_KEY` localStorage usage
- This makes the countdown honest and consistent across sessions

---

## FIX 9 — Auth Role Fetch Race Condition
**File**: `src/hooks/useAuth.ts`
- Add `rolesLoading` state: `true` while fetching roles, `false` after
- Export `rolesLoading` from hook
- Combined loading = `loading || rolesLoading`

**File**: `src/contexts/AuthContext.tsx`
- Add `rolesLoading` to interface and context value

**File**: `src/components/ProtectedRoute.tsx`
- Use `loading || rolesLoading` for spinner condition (add `rolesLoading` to destructured context)

---

## FIX 10 — AI Matchmaking Error Guard
**File**: `src/components/AIMatchmakingDialog.tsx` (lines 77-148)
- The `handleSubmit` already has try-catch but shows a generic toast on error
- Add an `error` state. On catch, set `error = true` and show fallback UI inside the dialog:
  - Title: "AI Matching Coming Soon!"
  - Body in Hindi
  - "Browse All Vendors" button → `/categories`
- This replaces the broken state with a usable fallback

---

## Design Fixes

### Color Consistency
- Audit CTA buttons in Index.tsx, MobileHomeScreen.tsx, VendorOnboarding.tsx, Auth.tsx
- Hero CTA in MobileHomeScreen (line 314): change from `bg-gradient-to-r from-primary to-primary/90` to just `bg-primary` (consistent solid fill)
- Primary actions use `variant="default"` (magenta), secondary use `variant="outline"` or `variant="ghost"`

### GlassCard cleanup
**File**: `src/components/GlassCard.tsx`
- Already clean (just applies glass classes). No gradient + blur overlap issue here. The glass utility classes in CSS handle this. No change needed.

---

## DB Migration Required
Add `discount_amount` column to `vendor_subscriptions`:
```sql
ALTER TABLE public.vendor_subscriptions 
ADD COLUMN IF NOT EXISTS discount_amount numeric DEFAULT 0;
```

---

## Summary of Changes

| # | File(s) | Change |
|---|---------|--------|
| 1 | VendorAuth.tsx | Enhanced register CTA text |
| 2 | MobileHomeScreen.tsx | Fix vendor stat 50+ → 5,000+ |
| 3 | Messages.tsx | Fix 4 bugs: realtime update, typing leak, cleanup, unread |
| 4 | ProtectedRoute.tsx | Add rolesLoading guard |
| 5 | VendorSubscriptionCheckout.tsx + migration | Fix price, add discount_amount, idempotency |
| 6 | Dashboard.tsx | Mobile quick actions 2x3 grid + "More" |
| 7 | Categories.tsx + CityVendors.tsx | Empty state with waitlist form |
| 8 | CountdownBanner.tsx | Real end-of-month countdown |
| 9 | useAuth.ts + AuthContext.tsx + ProtectedRoute.tsx | rolesLoading state |
| 10 | AIMatchmakingDialog.tsx | Error fallback UI |
| Design | MobileHomeScreen.tsx, Index.tsx | Button color consistency |

