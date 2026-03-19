

# Bug Fix Plan: 18 Bugs Across the Codebase

## Summary
Fix 18 bugs ranging from critical null crashes and memory leaks to medium-severity empty catch blocks and invalid CSS classes. Then publish.

---

## Files to Change

### 1. Checkout.tsx (CRITICAL)
- Add null guard on `response?.error?.description` in payment.failed handler
- Add `setProcessing(false)` in the failed handler
- Add null guard on `orderData.order` before accessing `.amount` and `.id`

### 2. BhindiHeader.tsx (CRITICAL)
- Change `windowWidth` initial state from `undefined` to `window.innerWidth` (safe since this only runs client-side)
- This prevents blank nav on first render

### 3. NotificationCenter.tsx (CRITICAL)
- Return the cleanup function from `setupRealtimeSubscription()` in the useEffect to prevent memory leak

### 4. VendorDashboard.tsx (CRITICAL)
- `loadStats` uses stale `vendor` closure for `vendor?.average_rating` — pass vendorData as parameter instead
- Add safe `Number()` with `|| 0` fallback for `total_amount`
- Add error handling for the DB query in `loadStats`

### 5. AIWeddingPlanner.tsx (CRITICAL)
- Add null check: `data?.response` before using it — show error toast if missing

### 6. ContractGenerator.tsx (CRITICAL)
- Add null guard on `contract.client_name` before `.replace()` — use `(contract.client_name || 'Unknown').replace(...)`

### 7. VendorCRM.tsx (HIGH)
- `moveToStage` and `saveNote`: check for `error` from supabase responses, show error toast on failure instead of false success

### 8. MusicGenerator.tsx (HIGH)
- `loadSavedSongs`: Add `console.error` in catch block instead of empty
- Wrap `response.json()` calls in try-catch for malformed responses

### 9. Dashboard.tsx (HIGH)
- `new Date(profile.wedding_date)` — validate with `isNaN` check, default to null if invalid

### 10. BudgetTracker.tsx (HIGH)
- `Number(booking.total_amount)` — use `Number(booking.total_amount) || 0` to prevent NaN

### 11. GuestList.tsx (HIGH)
- `g.plus_ones` could be null — use `(g.plus_ones || 0)` in all calculations

### 12. MessagingDialog.tsx (MEDIUM)
- Line 54: `if (!vendor) return;` — add `setLoading(false)` before early return

### 13. BookingCancellationDialog.tsx (MEDIUM)
- Validate `weddingDate` with `isNaN` check before calculating refund, default to 0% refund if invalid

### 14. Moodboards.tsx (MEDIUM)
- Line 82: `catch { /* ignored */ }` — add `console.error` for debugging

### 15. Checklist.tsx (MEDIUM)
- Line 196: `catch { /* ignored */ }` — add `console.error` for debugging

### 16. MobileLayout.tsx (MEDIUM)
- Remove non-existent `pt-safe` class
- Remove the conditional that adds it (or replace with proper safe-area padding via style)

### 17. Search.tsx + VendorCard.tsx + other files (MEDIUM)
- All `vendor.business_name.charAt(0)` calls — use `(vendor.business_name || 'V').charAt(0)`
- Apply to: Search.tsx, VendorCard.tsx, Compare.tsx, AIMatchResults.tsx, SponsoredVendorsCarousel.tsx, VendorComparisonToggle.tsx, VendorVerificationPanel.tsx

### 18. validation.ts (MEDIUM)
- Update name regex from `/^[a-zA-Z\s]+$/` to `/^[a-zA-Z\s'\-\.]+$/` to allow hyphens, apostrophes, and dots
- Apply to both `contactFormSchema` and `signupFormSchema`
- Update error message accordingly

---

## After All Fixes
Publish the app.

