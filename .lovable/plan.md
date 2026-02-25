

# Masterstroke Growth Engine + HD Image Overhaul

## Philosophy

Big brands like Spotify (Wrapped), Zomato (year-in-review), CRED (rewards theater), and Duolingo (guilt-trip notifications) all do one thing: they build features that **users screenshot and share without being asked**. The goal is to create "screenshot moments" -- outputs so visually striking or emotionally resonant that people WANT to put them on their WhatsApp status, Instagram story, or send to family groups.

Below are 5 unconventional, never-seen-in-wedding-tech features + a full image quality overhaul.

---

## Part A: Masterstroke Features

### 1. "Shaadi Wrapped" -- Your Wedding Planning Year-in-Review

**Inspiration**: Spotify Wrapped, Zomato Feeding India
**What it does**: After a user has been on the platform for a while (or at year-end), generate a beautiful, swipeable, story-format summary:
- "You browsed 47 vendors across 3 cities"
- "Your dream budget: 12 Lakhs"  
- "Your top category: Photography (viewed 23 times)"
- "You saved Rs 2.3L vs market average"
- "Your wedding vibe: Royal Rajasthani"

Each slide is a full-screen, branded card -- designed for screenshotting. Final slide: "Share your Shaadi Wrapped" with WhatsApp/Instagram story export.

**Why it's genius**: Zero effort from users. Data is already tracked. Creates viral FOMO among friends who haven't started planning.

**Technical approach**:
- New page: `src/pages/ShaadiWrapped.tsx`
- Full-screen swipeable story viewer (reuse Web Stories pattern)
- Canvas API to generate shareable 1080x1920 story cards
- Pull data from existing tables (favorites, bookings, search history)
- Trigger after 3rd session or via "Your Wrapped is Ready" notification

---

### 2. "Wedding Compatibility Score" -- Couples Quiz That Goes Viral

**Inspiration**: BuzzFeed quizzes, 16Personalities, Rice Purity Test
**What it does**: A fun 10-question quiz couples take together:
- "Who handles the budget?" / "Mandap or beach?" / "DJ or live band?"
- Generates a "Wedding Compatibility Score" (e.g., 87%)
- Shows a fun personality type: "The Royal Planner" / "The Chill Couple" / "The Pinterest Perfectionist"
- Beautiful result card with both names, score, and type
- One-tap WhatsApp share: "We got 92%! Take the quiz: [link]"

**Why it's genius**: Couples WILL share this in family WhatsApp groups. Each share = free acquisition. No signup required. Quiz results page becomes a landing page.

**Technical approach**:
- New page: `src/pages/CoupleQuiz.tsx`
- 10 fun multiple-choice questions with animated transitions
- AI personality classification using Gemini Flash
- Canvas-generated result card (1080x1080 square for Instagram)
- Shareable URL: `/quiz/result/:id`
- Store results in database for re-sharing

---

### 3. "Vendor Roast" -- AI Brutally Honest Wedding Budget Reality Check

**Inspiration**: CRED's irreverent ads, Wendy's Twitter roasts
**What it does**: User enters their city, guest count, and budget. AI gives them a brutally honest, funny reality check:
- "You want 500 guests in Delhi for 5 lakhs? That's not a wedding, that's a potluck with fairy lights."
- "Your photography budget of Rs 20K will get you someone's cousin with an iPhone 15."
- Then smoothly transitions to: "But here's how to actually make it work..." with real vendor recommendations.

**Why it's genius**: Humor is the most shared content format in India. People will screenshot the roast and share it. The "roast" is the hook, vendor recommendations are the conversion.

**Technical approach**:
- New page: `src/pages/BudgetRoast.tsx`
- Simple 3-field form (city, guests, budget)
- Edge function using Gemini Flash with a "wedding comedian" system prompt
- Animated typewriter reveal of the roast
- "Share the Roast" button generates a branded image
- Smooth CTA at bottom: "Now let's actually plan this properly"

---

### 4. "Ghost Vendor Detector" -- Check If Your Vendor Is Legit

**Inspiration**: "Is this website safe?" tools, CRED trust score
**What it does**: Enter any vendor's name/phone/Instagram handle. Platform checks:
- Are they registered on Karlo Shaadi? (verified badge)
- Do they have reviews? How many?
- Response time average
- "Trust Score" out of 100

If NOT on the platform: "This vendor isn't verified. Want us to check them out? We'll reach out and verify them for you."

**Why it's genius**: Creates a moat. Couples will Google "is [vendor name] legit" -- this tool captures that intent. Vendors who get checked will want to register to improve their score. It's a self-reinforcing growth loop.

**Technical approach**:
- New page: `src/pages/VendorCheck.tsx`
- Search against existing vendor database
- For unregistered vendors, create a "vendor_check_requests" table
- Generate a trust report card (shareable)
- Edge function to auto-email/WhatsApp unregistered vendors: "Someone checked your profile on Karlo Shaadi"

---

### 5. "Shaadi Countdown" -- Live Widget That Lives on Lock Screens

**Inspiration**: Apple Widgets, Notion calendar widgets
**What it does**: After setting a wedding date, users get a beautiful countdown widget:
- "147 days until Priya & Rahul's wedding"
- Updates daily with a micro-task: "Today: Finalize photographer shortlist"
- Shareable as an image for WhatsApp DP or Instagram highlight

But the masterstroke: a **public countdown page** (`/countdown/:slug`) that couples share with family. Family members visit daily = recurring traffic. Page includes "Help them plan -- browse gift ideas" and "Are you a vendor? Get listed."

**Technical approach**:
- New component: `src/components/ShaadiCountdown.tsx`  
- New public page: `src/pages/CountdownPublic.tsx`
- Uses wedding date from profile/wedding_websites table
- Daily task suggestions from a curated checklist
- Canvas-generated daily countdown image (auto-sharable)

---

## Part B: HD Image Overhaul + Clutter Reduction

### Image Quality Upgrade

The current `LazyImage` component loads images as-is with no quality optimization for local assets. All 55+ images in `src/assets/` are bundled at original resolution, which can be both too large (slow load) AND not sharp enough on retina screens.

**Approach**:
1. **Create an `EnhancedImage` wrapper** that replaces all raw `<img>` tags across the homepage
   - Adds proper `loading="lazy"`, `decoding="async"`, CSS `image-rendering: auto`
   - Applies subtle CSS sharpening via `filter: contrast(1.02) saturate(1.05)` for richer colors
   - Adds a cinematic film-grain overlay option for hero/section images
   - Smooth blur-up placeholder transition (already in LazyImage, extend to all)

2. **Replace direct `<img>` tags** in Index.tsx, BentoGrid.tsx, TensionsSection.tsx, LiveActivityFeed.tsx, and ReviewsSection.tsx with the enhanced component

3. **Add CSS-level image enhancement** in `index.css`:
   - `.img-cinematic` class with subtle color grading
   - `.img-sharp` class for portfolio/vendor images
   - Better `object-fit` and `object-position` handling

### Clutter Reduction on Homepage

The current Index page has **11 sections** stacked vertically. This will be streamlined:

1. **Remove redundant sections**: The "Expert Vendors" section (lines 316-370) largely duplicates BentoGrid's "5,000+ Verified Vendors" card. Merge into one.
2. **Consolidate stats**: TrustStatsBanner + BentoGrid "By the Numbers" card show overlapping data. Keep only the TrustStatsBanner.
3. **Add the unused `LiveActivityFeed`**: It's built but never imported on the homepage. Add it to replace one of the redundant sections -- it's more dynamic and engaging.
4. **Tighten spacing**: Reduce excessive `py-16 sm:py-24 md:py-32` padding to `py-10 sm:py-14 md:py-20` for a more app-like scroll density.
5. **Remove emoji usage** from section headers (per premium aesthetic standard).

---

## Technical Summary

| Feature | Files Created | Key Tech |
|---|---|---|
| Shaadi Wrapped | `src/pages/ShaadiWrapped.tsx` | Canvas API, Embla carousel, localStorage |
| Couple Quiz | `src/pages/CoupleQuiz.tsx`, edge function | Gemini Flash, Canvas API, shareable URLs |
| Budget Roast | `src/pages/BudgetRoast.tsx`, edge function | Gemini Flash, typewriter animation |
| Ghost Vendor Detector | `src/pages/VendorCheck.tsx`, DB table | Search, trust scoring, vendor outreach |
| Shaadi Countdown | `src/components/ShaadiCountdown.tsx`, `src/pages/CountdownPublic.tsx` | Date math, Canvas API, public pages |
| HD Image Overhaul | `src/components/CinematicImage.tsx`, edits to Index/BentoGrid/CSS | CSS filters, blur-up, lazy loading |
| Clutter Reduction | Edits to `Index.tsx` | Section consolidation, spacing |

All features are designed to be **zero-signup, shareable-first** -- users discover the platform through outputs they can't resist sharing.

