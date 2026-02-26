

## Plan: Add Influencer/Anchor Categories + Vendor Productivity Tools

### Part 1: New Vendor Categories

The current `vendor_category` enum has 16 categories. We need to add new ones for **influencers**, **anchors/emcees**, and potentially **wedding content creators**.

**Database Migration:**
- Add new values to the `vendor_category` enum: `influencer`, `anchor`, `content-creator`
- These professionals can then register, get verified, and appear in the marketplace

**UI Updates:**
- Update `src/pages/VendorOnboarding.tsx` category selector to include the new categories with appropriate labels
- Update `src/pages/Categories.tsx` to display the new categories with icons
- Add category images/icons for the new types

---

### Part 2: Vendor Productivity Tools (New Dashboard Tab)

Add a **"Tools"** tab to the Vendor Dashboard (`src/pages/VendorDashboard.tsx`) with productivity features:

**Tool 1 - AI Quote Generator**
- Vendors enter event details (date, type, guest count, location) and get a professional quote/proposal they can copy or download as PDF
- Uses the existing Lovable AI integration (no extra API key needed)

**Tool 2 - Client Follow-Up Reminders**
- Shows a list of inquiries that haven't been responded to or followed up on (from `vendor_inquiries` table)
- Highlights stale leads (older than 24h, 48h, 7d) with color-coded urgency
- One-click "Mark as Followed Up" action

**Tool 3 - Social Media Caption Generator**
- AI-powered tool: vendor uploads a portfolio image or describes their work, gets ready-to-post Instagram/WhatsApp captions with hashtags
- Tailored to Indian wedding industry keywords

**Tool 4 - Quick Invoice Generator**
- Simple form: client name, service, amount, date, notes
- Generates a branded PDF invoice with the vendor's business name and logo (using jsPDF, already installed)

**Tool 5 - Seasonal Demand Insights**
- Shows upcoming muhurat dates (from existing `muhuratDates2025` data) and high-demand periods
- Suggests when to run promotions or increase pricing

### Files to Create
1. `src/components/vendor/VendorToolkit.tsx` - Main tools container with sub-tool cards
2. `src/components/vendor/QuoteGenerator.tsx` - AI quote/proposal builder
3. `src/components/vendor/InvoiceGenerator.tsx` - PDF invoice creator
4. `src/components/vendor/CaptionGenerator.tsx` - Social media caption AI tool
5. `src/components/vendor/FollowUpTracker.tsx` - Lead follow-up reminders
6. `src/components/vendor/SeasonalInsights.tsx` - Demand calendar/insights

### Files to Edit
1. **Database migration** - Add `influencer`, `anchor`, `content-creator` to `vendor_category` enum
2. `src/pages/VendorDashboard.tsx` - Add "Tools" tab with `Wrench` icon pointing to `VendorToolkit`
3. `src/pages/VendorOnboarding.tsx` - Add new categories to the registration form
4. `src/pages/Categories.tsx` - Display new categories in the browse grid
5. `src/pages/ForVendors.tsx` - Mention productivity tools as a selling point

### Technical Notes
- AI features (Quote Generator, Caption Generator) will use Lovable AI via an edge function with `gemini-2.5-flash` for speed
- Invoice PDF generation uses the already-installed `jspdf` library
- Follow-up tracker queries existing `vendor_inquiries` table -- no new tables needed
- Seasonal insights reuse existing `muhuratDates2025` data

