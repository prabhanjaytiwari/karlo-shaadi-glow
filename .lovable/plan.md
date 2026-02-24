

# Karlo Shaadi: Deep Meaning + Social Impact + Self-Marketing Overhaul

This plan transforms Karlo Shaadi from a wedding marketplace into a purpose-driven platform with the tagline: **"Every Wedding You Plan Helps Someone Get Married."**

---

## Part 1: Logo Transparency

**File:** `src/assets/logo-new.png`
- Use CSS `mix-blend-mode: multiply` on the logo image across all instances (Header, Footer) to visually remove any white background
- This avoids needing to re-export the PNG and works instantly

**Files to modify:** `src/components/BhindiHeader.tsx`, `src/components/BhindiFooter.tsx`

---

## Part 2: Shaadi Seva -- The Social Impact Mission

### Core Concept
Every payment on the platform (vendor bookings, premium subscriptions, vendor profile setup) automatically earmarks 10% toward **Shaadi Seva Fund** -- a fund supporting financially disadvantaged couples and Saamuhik Vivaah (mass wedding) events.

### 2a. New Page: `/shaadi-seva` (Mission Page)

**File:** `src/pages/ShaadiSeva.tsx`

Sections:
1. **Hero:** "Your Wedding Helps Someone Else Get Married" -- emotional storytelling with impact stats
2. **How It Works:** Visual flow showing 10% from every booking going to the fund
3. **Live Impact Counter:** Total raised, weddings funded, beneficiaries helped (starts with seed values, auto-increments from real payments)
4. **Saamuhik Vivaah Section:** Explain mass wedding support -- what it is, how couples can apply
5. **Apply for Support Form:** Simple form for financially disadvantaged couples to apply (name, phone, city, situation description, wedding date, estimated need)
6. **Partner With Us:** Call for NGOs, trusts, and community organizations to collaborate

### 2b. Database Table: `shaadi_seva_applications`

```text
shaadi_seva_applications
- id (uuid, PK)
- applicant_name (text)
- phone (text)
- city (text)
- situation (text)
- wedding_date (date, nullable)
- estimated_need (numeric, nullable)
- status (text, default 'pending') -- pending, approved, funded, completed
- created_at (timestamptz)
- approved_at (timestamptz, nullable)
- funded_amount (numeric, default 0)
```
RLS: Public INSERT, Admin SELECT/UPDATE

### 2c. Database Table: `shaadi_seva_fund`

```text
shaadi_seva_fund
- id (uuid, PK)
- payment_id (text) -- reference to razorpay payment
- booking_id (uuid, nullable)
- source_type (text) -- 'booking', 'subscription', 'vendor_setup', 'direct_donation'
- total_amount (numeric) -- original payment amount
- seva_amount (numeric) -- 10% contribution
- created_at (timestamptz)
```
RLS: Public SELECT (transparency), Admin INSERT/UPDATE

### 2d. Impact Counter Component

**File:** `src/components/ShaadiSevaCounter.tsx`

A reusable component showing:
- Total fund amount raised (SUM from shaadi_seva_fund)
- Number of weddings supported (COUNT from applications where status = 'funded' or 'completed')
- Displayed on homepage, pricing page, and checkout confirmation

### 2e. Integration with Payments

Update `verify-payment` edge function to automatically insert a record into `shaadi_seva_fund` with 10% of every successful payment. This is auto-tracking -- no manual intervention needed.

### 2f. Pricing Page Update

Add a badge on the pricing page: "10% of every payment goes to Shaadi Seva -- helping couples in need get married"

---

## Part 3: Hero Section Image Alignment Fix

**File:** `src/pages/Index.tsx`

- Fix hero image `object-position` to `center 30%` (focus on couple, not sky) on both mobile and desktop
- On mobile: reduce hero to `min-h-[60vh]` with tighter padding
- On desktop: ensure full viewport height with proper centering
- Add `object-position: center 25%` for better framing of the wedding ceremony image

---

## Part 4: Self-Marketing / Viral Mechanics

### 4a. Shaadi Seva Badge on Every Shareable Output

Every tool output (wedding plan, budget result, invite, speech) will include:
> "Powered by Karlo Shaadi -- 10% of every wedding helps someone in need"

This turns every share into social impact marketing.

### 4b. Free Shaadi Seva Widget for Wedding Websites

**File:** `src/components/ShaadiSevaWidget.tsx`

An embeddable "This wedding supports Shaadi Seva" badge that couples can add to their wedding websites. Each widget links back to karloshaadi.com/shaadi-seva.

### 4c. Auto-Share on Milestone

When a couple completes a booking, show a celebratory modal with WhatsApp share:
> "I just booked my [category] vendor on Karlo Shaadi! And 10% of my payment helps fund a wedding for someone in need. Plan yours: karloshaadi.com"

**File:** Update `src/pages/PaymentSuccess.tsx` with social share prompt

### 4d. Referral Enhancement

Update the referral share message to include the social cause:
> "Plan your wedding on Karlo Shaadi -- free tools, verified vendors, and 10% of every payment helps fund weddings for those in need!"

---

## Part 5: Automation -- Reaching People in Need

### 5a. Auto-Outreach Edge Function

**File:** `supabase/functions/shaadi-seva-outreach/index.ts`

A function that can be triggered (manually or via cron) to:
- Check for new Shaadi Seva applications
- Send WhatsApp-style notification to admin about pending applications
- Log outreach events for tracking

### 5b. Admin Dashboard Tab for Shaadi Seva

**File:** Update `src/pages/AdminDashboard.tsx`

Add a new "Shaadi Seva" tab showing:
- Pending applications with approve/reject actions
- Fund balance and transaction history
- Impact metrics (total raised, weddings funded)

---

## Part 6: Complete Missing Functionalities

### 6a. Fix Non-Working Buttons

- **"Start Planning Free" button** (Index.tsx line 410-412): Link to `/plan-wizard`
- **"Join as Vendor" button** (Index.tsx line 288-290): Link to `/for-vendors`
- **"Browse All Vendors" button** (Index.tsx line 352): Already linked, verify working

### 6b. Footer: Add Shaadi Seva Link

Add "Shaadi Seva" to the Company section of footer links

### 6c. Header: Add Shaadi Seva in Navigation

Add "Shaadi Seva" as a heart-icon link in the desktop nav (next to Deals, with a distinct warm color)

---

## Part 7: Mobile Optimization Pass

### WhatsApp Button Repositioning

**File:** `src/components/WhatsAppButton.tsx`
- Detect if bottom nav is visible and move button to `bottom-20` to prevent overlap
- Reduce size to `h-12 w-12` on mobile

### Global CSS Mobile Tweaks

**File:** `src/index.css`
- Add `-webkit-tap-highlight-color: transparent`
- Add `touch-action: manipulation` to prevent double-tap zoom
- Add `overscroll-behavior: none` to prevent iOS bounce

---

## Technical Summary

### New Files (5):
1. `src/pages/ShaadiSeva.tsx` -- Mission page with impact counter, application form
2. `src/components/ShaadiSevaCounter.tsx` -- Reusable impact counter
3. `src/components/ShaadiSevaWidget.tsx` -- Embeddable badge for wedding websites
4. `supabase/functions/shaadi-seva-outreach/index.ts` -- Auto-outreach function

### Files to Modify (9):
1. `src/App.tsx` -- Add `/shaadi-seva` route
2. `src/pages/Index.tsx` -- Hero image fix, button links, add Seva counter section
3. `src/pages/PaymentSuccess.tsx` -- Add social share modal with Seva messaging
4. `src/components/BhindiHeader.tsx` -- Logo transparency, add Shaadi Seva nav link
5. `src/components/BhindiFooter.tsx` -- Logo transparency, add Shaadi Seva footer link
6. `src/components/WhatsAppButton.tsx` -- Mobile repositioning
7. `src/index.css` -- Mobile-native CSS tweaks
8. `src/pages/AdminDashboard.tsx` -- Add Shaadi Seva admin tab
9. `supabase/config.toml` -- Add outreach function config

### Database Migration (2 new tables):
1. `shaadi_seva_applications` -- Beneficiary applications
2. `shaadi_seva_fund` -- Payment contribution tracking

### No New Dependencies
All changes use existing libraries (Tailwind, Lucide icons, Supabase client, jspdf).

