

## 50% First-Month Discount + Sales Psychology Overhaul

### What Changes

Add a **persistent 48-hour countdown timer** and **50% first-month discount** across all pricing pages, plus layer in proven sales psychology triggers throughout.

### Sales Psychology Tactics to Implement

1. **Anchoring** — Show original price crossed out, discounted price next to it (₹~~9,999~~ → ₹4,999)
2. **Scarcity + Urgency** — 48-hour countdown timer, "Only X spots left at this price"
3. **Loss Aversion** — "You're losing ₹X in potential bookings every day without Gold"
4. **Social Proof** — "847 vendors upgraded this month"
5. **Price Reframing** — "That's just ₹83/day" (for Silver at ₹2,499)
6. **Risk Reversal** — "100% money-back guarantee if you don't get 3 leads in 30 days"
7. **Decoy Effect** — Make Gold visually dominant so Diamond feels like a steal
8. **Bandwagon** — "Most popular in your city" badge

### Countdown Timer Component

New reusable `CountdownBanner` component:
- 48-hour countdown stored in `localStorage` (starts on first visit)
- Persists across page reloads
- Shows HH:MM:SS in bold, pulsing digits
- Red/urgent styling when < 6 hours remain
- Banner text: "🔥 Launch Offer: 50% OFF First Month — Ends in XX:XX:XX"

### Price Updates (First Month Only)

| Plan | Original | Discounted | Per Day |
|------|----------|------------|---------|
| Silver | ₹4,999 | ₹2,499 | ₹83/day |
| Gold | ₹9,999 | ₹4,999 | ₹166/day |
| Diamond | ₹19,999 | ₹9,999 | ₹333/day |
| AI Premium (Couples) | ₹999 | ₹499 | ₹16/day |

### Files to Create/Edit

| File | Change |
|------|--------|
| `src/components/CountdownBanner.tsx` | **New** — Reusable 48hr countdown with localStorage persistence |
| `src/pages/VendorPricing.tsx` | Add discount pricing, countdown, anchoring, social proof, loss aversion, risk reversal, per-day reframing |
| `src/pages/Pricing.tsx` | Add discount on AI Premium, countdown banner, urgency triggers |
| `src/components/vendor/VendorSubscriptionCheckout.tsx` | Show discounted first-month price in checkout dialog |
| `src/pages/SubscriptionCheckout.tsx` | Show discounted first-month price for AI Premium |

### Key UX Elements

- Sticky countdown banner at top of pricing pages (not global — only on pricing/checkout pages)
- Crossed-out original prices with red discount badges
- "Savings" callout: "You save ₹5,000" in green
- Per-day cost reframing below each price
- "100% money-back in 30 days" shield badge
- "847 vendors upgraded this month" counter
- "Most popular in Mumbai" dynamic city badge
- Pulsing "Limited Time" badge on cards
- Mobile: countdown banner is compact, sticky at top

