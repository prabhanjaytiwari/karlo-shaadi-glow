

## Enhanced Wedding Planner — Comprehensive Overhaul

### What Changes

**1. Wizard Overhaul (WeddingPlanWizard.tsx) — 8 Steps Instead of 5**

Current 5 steps are too basic. New flow with Indian-industry-specific questions:

| Step | Title | Fields |
|------|-------|--------|
| 1 | Who's Planning? | Bride/Groom side, Your name, Partner name |
| 2 | Wedding Details | Date, City, Religion/Community (Hindu, Muslim, Sikh, Christian, Jain, Buddhist, Inter-faith) |
| 3 | Ceremonies | Multi-select: Roka, Engagement, Haldi, Mehendi, Sangeet, Wedding, Reception, Vidaai, After-party + custom |
| 4 | Budget | Slider ₹2L–₹5Cr with realistic Indian tiers |
| 5 | Guest Count | Slider 50–5000, split by Bride side / Groom side |
| 6 | Preferences | Venue type (Banquet/Hotel/Farmhouse/Beach/Palace/Home), Food (Veg/Non-veg/Jain/Multi-cuisine), Alcohol (Yes/No/Bar only) |
| 7 | Style & Priorities | Wedding style + priority ranking (What matters most: Venue, Food, Photos, Decor, Entertainment) |
| 8 | Special Requirements | Baarat arrangements, Dhol/Band, Fireworks, Varmala stage, Vidhi mandap, Parking, Accommodation for outstation guests |

**2. Enhanced Edge Function (generate-wedding-plan)**

Updated AI prompt to generate:
- Detailed ceremony-wise budget (not just categories)
- Day-by-day event schedule (not just months-before timeline)
- Vendor recommendations per ceremony
- Realistic city-specific pricing
- Wedding manager recommendation section

**3. Enhanced Result Page (WeddingPlanResult.tsx) — 5 Tabs**

| Tab | Content |
|-----|---------|
| Overview | Couple card, ceremony list, key stats, day-wise schedule |
| Budget | Category-wise breakdown with ceremony allocation |
| Vendors | Suggested vendors per category with "Book Now" and "Get Quote" buttons linking to `/search?category=X&city=Y` |
| Timeline | Day-by-day event plan with tasks |
| Wedding Manager | CTA to hire Karlo Shaadi managers — shows packages (₹25K, ₹50K, ₹1L) with inquiry form |

**4. Mobile UX**
- Full-screen wizard steps with swipe gestures
- `MobilePageHeader` on result page
- `pb-24` for bottom nav clearance
- Compact card layouts, horizontal scroll for vendor suggestions
- App-like feel with motion transitions

### Files to Change

| File | Change |
|------|--------|
| `src/components/WeddingPlanWizard.tsx` | Complete rewrite — 8-step wizard with Indian wedding fields |
| `supabase/functions/generate-wedding-plan/index.ts` | Enhanced prompt with ceremony-specific budgets, day-wise schedule, vendor matching |
| `src/pages/WeddingPlanResult.tsx` | 5-tab layout, vendor booking CTAs, wedding manager section, mobile optimization |

### Technical Details

- WizardData interface expanded with: `religion`, `ceremonies[]`, `venueType`, `foodType`, `alcohol`, `brideSideGuests`, `groomSideGuests`, `priorities[]`, `specialRequirements[]`
- AI prompt restructured to output: `dayWiseSchedule[]`, `ceremonyBudgets[]`, `vendorSuggestions[]` (with category, estimated cost, booking link), `weddingManagerRecommendation`
- Result page vendor cards link to `/search?category=Photography&city=Mumbai` for real vendor discovery
- Wedding Manager section has an inquiry form saving to `vendor_inquiries` or a new simple table

