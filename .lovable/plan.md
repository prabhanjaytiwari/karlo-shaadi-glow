

## Analysis of Your Ideas

Let me evaluate each idea against viability, brand alignment, and growth potential:

### Ideas Ranked (Best to Implement Now → Later/Skip)

| # | Idea | Verdict | Why |
|---|------|---------|-----|
| 1 | **"Shaadi pe promotion karke earn money online"** | **BUILD** | Best framing — speaks to Indian aunties/uncles/friends who naturally promote vendors. Merges with existing EarnWithUs page but reframes it as "promote shaadis you attend" |
| 2 | **"Register your business — free unlimited leads"** | **BUILD** | Strong vendor acquisition hook. Enhance ForVendors page with this as the headline CTA |
| 3 | **"Sponsor Your Shaadi"** | **BUILD** | Unique revenue stream — brands sponsor elements of weddings (drinks by Coca-Cola, photo booth by Samsung). Creates a new marketplace |
| 4 | **Karlo Shaadi Podcast** | **PLAN ONLY** | Great for brand but needs a landing page + waitlist, not full implementation yet |
| 5 | **Karlo Shaadi Merch** ("?" tshirt, "Ho Gayi Shaadi?" tshirt) | **PLAN ONLY** | Fun brand play but needs e-commerce integration. Start with a teaser/waitlist page |
| 6 | **"₹20-50K mahine kamao" Instagram hook** | **CONTENT STRATEGY** | This is a marketing copy/reel idea, not a product feature. Already aligned with EarnWithUs page |
| 7 | **"Refer your shaadi and earn"** | **EXISTS** | Already built as EarnWithUs + Referral system |

---

## Plan: Build the Top 3 Ideas

### 1. Revamp EarnWithUs → "Shaadi Promote Karo, Paisa Kamao"

Reframe the existing `/earn` page with sharper Hindi-English hook:
- New hero: "Shaadi Attend Karo, Promote Karo, Earn Karo"
- 3 earning methods clearly shown:
  - **Refer a Couple** (existing) — ₹500-2000 per conversion
  - **Promote at Shaadi** — share QR code/branded content at weddings you attend, earn per scan/signup
  - **Become a Local Partner** — earn ₹20K-50K/month by connecting vendors in your city
- Add Instagram Reel script section: ready-made hooks vendors/partners can use

### 2. "Sponsor Your Shaadi" — New Page `/sponsor-shaadi`

A new concept page where:
- Couples can list their wedding for brand sponsorship (free drinks, decor upgrades, photo booths)
- Brands/local businesses can browse upcoming weddings to sponsor
- MVP: A simple interest form for both sides (couple + sponsor)
- Shows example sponsorship packages (₹10K-₹5L)
- This is a unique differentiator no competitor has

### 3. Merch + Podcast — Teaser Landing Page `/coming-soon`

Single page with two sections:
- **Karlo Shaadi Podcast** — "Real stories from real shaadis" — waitlist signup
- **Karlo Shaadi Merch** — Show 3-4 tshirt concepts ("?", "Ho Gayi Shaadi?", "Karlo Shaadi") — interest form
- Clean, hype-building page with countdown or "Notify Me" button

### Files to Create/Edit

| File | Change |
|------|--------|
| `src/pages/EarnWithUs.tsx` | Revamp with 3 earning methods, Hindi hooks, Instagram reel scripts |
| `src/pages/SponsorShaadi.tsx` | New page — sponsor marketplace concept with dual forms |
| `src/pages/ComingSoon.tsx` | New page — Podcast + Merch teaser with waitlist |
| `src/App.tsx` | Add routes for `/sponsor-shaadi` and `/coming-soon` |

### Mobile UX
- All pages use `MobilePageHeader` + `pb-24` bottom nav clearance
- Card-based layouts with motion animations
- WhatsApp share buttons on earning methods

