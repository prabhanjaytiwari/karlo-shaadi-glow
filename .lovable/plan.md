

## Plan: Add Social Media Manager Category + "Earn with Karlo Shaadi" Referral Program

### 1. Add "Social Media Manager" to Vendor Categories

The enum already has `social-media-managers` in the database. We just need to add it to the onboarding UI.

**File to edit:** `src/pages/VendorOnboarding.tsx`
- Add `{ value: "social-media-managers", label: "Shaadi Social Media Manager" }` to the CATEGORIES array

**File to edit:** `src/pages/Categories.tsx`
- Map `social-media-managers` slug to an appropriate image in the categoryImages record

---

### 2. New "Earn with Karlo Shaadi" Page (`/earn`)

A public-facing page (no login required to view) that serves as both a partner/associate program AND a mega referral contest. This replaces/extends the existing `/referrals` concept for non-users.

**New file:** `src/pages/EarnWithUs.tsx`

**Page sections:**

**Hero Section** - Bold headline: "Earn with Karlo Shaadi" with tagline about turning connections into rewards

**How It Works** - 3 simple steps:
1. Know someone getting married? Share their details
2. If they book through Karlo Shaadi, you earn rewards
3. Top referrers win mega prizes every month

**Prize Showcase** - Eye-catching grid/carousel of monthly prizes:
- Trip to Maldives
- Trip to Dubai
- Tata Safari Car
- iPhone 17 Pro Max
- MacBook M4
- Cash prizes (multiple tiers)
- "...and much more!"
- Note: "Winners announced every month starting now"

**Referral Form** - Simple form for anyone (no signup needed) to submit a lead:
- Your name, phone, email
- Referred person's name, phone, wedding month/year
- How do you know them (neighbor, friend, family, colleague)
- Submit stores to a new database table

**Leaderboard Preview** - Show top referrers (anonymized) and prize tiers

**CTA** - "Already a Karlo Shaadi user? Log in to track all your referrals" linking to `/referrals`

---

### 3. Database: New Table for Lead Referrals

**New table:** `lead_referrals`
- `id` (uuid, PK)
- `referrer_name` (text, required)
- `referrer_phone` (text, required)
- `referrer_email` (text)
- `referred_name` (text, required)
- `referred_phone` (text, required)
- `wedding_month` (text)
- `relation` (text) -- friend, neighbor, family, colleague
- `status` (text, default 'submitted') -- submitted, contacted, converted, rewarded
- `user_id` (uuid, nullable) -- if logged-in user submitted
- `notes` (text)
- `created_at` (timestamptz)

**RLS Policies:**
- Anyone can INSERT (public form)
- Logged-in users can SELECT their own (where user_id matches)
- Admins can SELECT/UPDATE all

---

### 4. Route + Navigation

**File to edit:** `src/App.tsx`
- Add route: `/earn` pointing to `EarnWithUs`

**File to edit:** `src/components/BhindiFooter.tsx`
- Add "Earn with Us" link in the footer navigation

---

### Technical Notes
- The prize showcase uses static content (no database needed for prizes)
- Form submission uses the new `lead_referrals` table with public INSERT policy
- Input validation via zod for phone numbers and required fields
- The page is fully public -- no authentication required to submit a lead
- Monthly winner announcements can be managed via the admin dashboard later

