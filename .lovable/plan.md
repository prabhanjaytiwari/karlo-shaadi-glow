

# Comprehensive Enhancement Plan: Tools, Pages, and UX Fixes

This plan addresses all 10 issues you raised, organized into logical work batches.

---

## Issue 1: Budget Display -- Crore Format Above 100 Lakhs

**Problem:** The `formatIndianCurrency` function and Wedding Plan Wizard show "Lakhs" even above 100L.

**Fix:**
- Update `src/data/budgetAllocation.ts` -- `formatIndianCurrency()` already handles Crore (10M+), but the Wedding Plan Wizard step 3 hardcodes "Lakhs" display. Will update the wizard to show "X Crore" when budget exceeds 100 (i.e., 100 Lakhs = 1 Crore).
- Update `src/components/WeddingPlanWizard.tsx` step 3 to use proper formatting: `data.budget >= 100 ? "X.XX Crore" : "X Lakhs"`

---

## Issue 2: Wedding Plan Tool -- Fix "Failed to Generate" Error

**Problem:** The edge function call fails with "Failed to send a request to the Edge Function". The function exists and config is correct, but it may not be deployed.

**Fix:**
- Redeploy `generate-wedding-plan` edge function
- Add better error handling in `WeddingPlanWizard.tsx` with user-friendly error messages and retry button
- Add rate limit (429) and payment (402) error handling display to the user
- The edge function code itself looks correct -- uses Lovable AI gateway with `google/gemini-2.5-flash`

---

## Issue 3: Muhurat Finder -- Faded/Low Opacity Dates

**Problem:** Past dates have `opacity-60` class making them hard to read, and the overall card styling is too subtle.

**Fix:**
- In `src/components/MuhuratFinder.tsx`: Remove `opacity-60` from past dates entirely, or change to `opacity-80` with a subtle "Past" label instead
- Boost the muhurat card CSS in `src/index.css`: increase background opacity from `bg-card/80` to `bg-card`, make date column backgrounds more vivid
- Add 2025 AND 2026 muhurat data support (the component only uses `MUHURAT_2025` but `MUHURAT_2026` exists in the data file)
- Update the header to say "2025-2026 Muhurat Calendar" instead of just "2025"

---

## Issue 4: Couple Quiz -- More Hinglish, Practical, Humorous

**Problem:** Questions are too generic and English-only.

**Fix:** Rewrite all 10 questions with a Hinglish tone and Indian wedding humor. Examples:

- "Shaadi ka budget kaun handle karega?" -> "Main karunga/karungi", "Mummy-Papa sambhal lenge", "Koi planner dhundho yaar", "Budget? Kya budget?"
- "Baraat mein naachoge ya seedha mandap?" -> "Full Govinda mode", "Shy smile only", "Horse pe entry bhai", "DJ pe nachte hue aayenge"
- "Honeymoon plan kiska hai?" -> "Maldives baby!", "Goa chalte hain", "Manali mein chill", "Honeymoon baad mein, pehle neend lo"

Also improve personality types with Hinglish descriptions and more wedding-relevant archetypes.

---

## Issue 5: Budget Calculator -- Better UI/UX and Realism

**Problem:** UI feels generic, not practical enough for Indian weddings.

**Fix:**
- Add more budget categories relevant to Indian weddings: Trousseau/Outfits, Gifts/Shagun, Pandit/Havan Samagri, Baraat arrangements
- Add a "per plate cost" estimate based on city + budget (practical metric Indian families understand)
- Add "cost per guest" display
- Increase slider max to 5 Crore (50M) for royal weddings
- Show Crore formatting when above 1 Crore
- Add vendor-tier hints (e.g., "At this budget in Mumbai, you can expect: 4-star venue, premium photographer")
- Improve mobile layout: stack pie chart above breakdown, larger touch targets
- Add a "Save & Share PDF" option

---

## Issue 6: Invite Creator -- Use Nano Banana Pro, Better UX

**Problem:** Current implementation works but UX needs polish. Already uses `google/gemini-3-pro-image-preview` (Nano Banana Pro).

**Fix:**
- Already uses the correct model -- keep it
- Add more Indian wedding-specific styles: South Indian, Bengali, Punjabi, Gujarati, Muslim Nikah
- Add event-type selection: Wedding, Engagement, Haldi, Mehendi, Reception, Sangeet
- Add Hindi/regional language text option for the invitation
- Simplify form: reduce required fields, add smart defaults
- Improve preview section with loading skeleton and better error states
- Add "Quick Templates" -- pre-filled example invitations users can one-click generate

---

## Issue 7: Categories Page -- Slow Load, No Pictures, No Tabs

**Problem:** Page loads everything from database (slow), no category filtering tabs within the page, images are static imports.

**Fix:**
- Add horizontal scrollable category tabs at the top of the page (like the Search page already has)
- Use the existing static category images (`src/assets/category-*.jpg`) which already cover all categories -- no need for AI generation (faster, reliable)
- Add skeleton loading states for the grid
- Optimize the database query: only load categories initially, load vendors on-demand when a category is selected
- On mobile: use a compact 2-column grid with images, add MobilePageHeader

---

## Issue 8: Search Page -- Show Popular Vendors by Default

**Problem:** Empty state when no search query; mobile UI needs improvement.

**Fix:**
- When no search query/filters are active, auto-load vendors sorted by `average_rating DESC, total_reviews DESC` (popularity sort)
- Show a "Popular Vendors" section header
- On mobile: improve card layout with tighter spacing, remove unused SmartVendorMatch section, show city filter as a bottom sheet
- Add category images as visual chips instead of plain text pills

---

## Issue 9: Tools Tab -- Opens Budget Calculator Directly

**Problem:** The bottom nav "Tools" link (`/budget-calculator`) goes directly to Budget Calculator instead of showing a tools landing page.

**Fix:**
- Create a new `src/pages/ToolsLanding.tsx` page with a grid of all available tools:
  - Budget Calculator
  - Muhurat Finder
  - Invite Creator
  - Wedding Plan Generator
  - Music Generator
  - Speech Writer
  - Couple Quiz
  - Vendor Checker
  - Budget Roast
  - Moodboard Builder
- Each tool shows: icon, name, 1-line description, and links to its route
- Add route `/tools` in `App.tsx`
- Update bottom nav Tools link from `/budget-calculator` to `/tools`

---

## Issue 10: Make Wedding Plan Tool More Practical

**Problem:** The plan wizard is too simple. Needs more Indian wedding industry-specific inputs.

**Fix:**
- Add a "Number of Events" step: Haldi, Mehendi, Sangeet, Wedding, Reception (checkboxes) -- this affects budget allocation
- Add a "Wedding Type" clarification: Hindu, Muslim, Christian, Sikh, Inter-faith
- Show budget in Crore when appropriate (connects to Issue 1)
- Improve the AI prompt to include selected ceremonies in the plan output
- Add "Vendor Availability" note for the selected date based on muhurat data

---

## Implementation Order

| # | Task | Files |
|---|------|-------|
| 1 | Fix wedding plan edge function deployment + error handling | Edge function deploy, `WeddingPlanWizard.tsx` |
| 2 | Fix budget Crore formatting | `budgetAllocation.ts`, `WeddingPlanWizard.tsx` |
| 3 | Fix muhurat opacity + add 2026 support | `MuhuratFinder.tsx`, `index.css` |
| 4 | Rewrite couple quiz (Hinglish) | `CoupleQuiz.tsx` |
| 5 | Enhance budget calculator | `BudgetCalculator.tsx`, `budgetAllocation.ts` |
| 6 | Enhance invite creator | `InviteCreator.tsx` |
| 7 | Create Tools landing page | New `ToolsLanding.tsx`, `App.tsx`, `BottomNavigation.tsx` |
| 8 | Fix categories page | `Categories.tsx` |
| 9 | Fix search page (popular vendors) | `Search.tsx` |
| 10 | Enhance wedding plan wizard | `WeddingPlanWizard.tsx`, edge function |

---

## Technical Notes

- No database changes needed -- all fixes are frontend/edge function
- Edge function `generate-wedding-plan` needs redeployment
- The "Failed to fetch" errors in network logs suggest the Supabase instance may have been temporarily unreachable -- the edge function code itself is correct
- Existing category images in `src/assets/` will be reused instead of AI-generating new ones (faster, more reliable)
- All changes maintain desktop compatibility while improving mobile-first experience

