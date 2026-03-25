

# ForVendors.tsx — Complete Sales Landing Page Redesign

## Goal
Transform `/for-vendors` into a high-conversion sales landing page for Facebook/Instagram ad campaigns. Every section drives toward "Register Free Now" CTA. AI-generated hero and section images via Nano Banana Pro for realistic Indian wedding vendor visuals.

## Current State
Page has: Hero, stats strip, 6 benefits, 6 categories, 4-step how-it-works, 3 testimonials, FAQ, final CTA. Decent structure but lacks:
- Pricing tiers inline (forces separate page visit = drop-off)
- Tool showcase (vendors don't know what dashboard tools they get)
- Urgency/scarcity ("First 500 vendors" offer not shown)
- Comparison table vs competitors (WedMeGood, ShaadiSaga)
- Social proof numbers (revenue generated, leads delivered)
- Video/visual storytelling of the vendor dashboard
- Early bird / limited-time offer section

## New Page Structure (Top to Bottom)

### 1. Hero Section (Keep, enhance)
- Stronger headline: "Apna Wedding Business 10x Karo — Zero Commission"
- Sub: "500+ vendors already growing. Kya aap next ho?"
- Two CTAs: "Register Free" + "Watch Demo" (scroll to dashboard preview)
- AI-generated image: Indian wedding photographer in action at a venue

### 2. Trust Strip (Keep, enhance)
- Add: "₹2Cr+ Revenue Generated" and "10,000+ Leads Delivered"

### 3. Problem-Solution Section (NEW)
- "Tired of 15-20% commission?" comparison table
- Karlo Shaadi vs WedMeGood vs ShaadiSaga — simple 3-column grid
- Highlights: Commission %, Lead quality, Dashboard tools, Contract lock-in

### 4. What You Get — Tool Showcase (NEW)
- Visual cards showing actual dashboard features vendors get FREE:
  - Smart CRM with lead pipeline
  - Digital contracts & invoices
  - Portfolio mini-site (SEO-optimized)
  - Business analytics dashboard
  - WhatsApp integration
  - Payment tracking
- AI-generated images for each tool card

### 5. How It Works (Keep, redesign)
- 4 steps with AI-generated illustrations

### 6. Pricing Tiers Inline (NEW — pulled from VendorPricing)
- Show all 4 plans (Free, Starter, Pro, Elite) directly on this page
- No need to navigate away — reduces drop-off
- "Register Free" for Free plan, "Start Free, Upgrade Later" messaging

### 7. Early Vendor Advantage (NEW)
- "First 500 Vendors — Free Forever" badge
- Countdown/scarcity: "Only X spots left in your city"
- Special benefits for early joiners

### 8. Vendor Success Stories (Keep, enhance)
- Add revenue numbers, before/after metrics
- AI-generated vendor portrait images

### 9. Categories Welcome (Keep)

### 10. FAQ (Keep)

### 11. Final CTA — Full-width immersive (Keep, enhance)

## AI Image Generation Plan

Create an edge function `generate-vendor-landing-images` that generates images via Nano Banana Pro and stores them in `site-assets` bucket. Images needed:

1. **Hero**: Indian wedding photographer shooting at a decorated mandap venue, cinematic
2. **Dashboard Preview**: Mock vendor dashboard on laptop screen, Indian wedding context
3. **CRM Tool**: Vendor managing leads on phone, wedding venue background
4. **Contract Tool**: Professional contract being signed, Indian wedding setting
5. **Portfolio Tool**: Photographer showcasing portfolio on tablet
6. **Analytics Tool**: Business charts on screen with wedding decor backdrop
7. **Early Bird**: Golden ticket / VIP pass visual, Indian wedding aesthetic
8. **Success Story Portraits**: 3 Indian vendor portraits (photographer, caterer, decorator)

These will be generated once and cached in storage.

## Implementation

### File 1: `supabase/functions/generate-vendor-landing-images/index.ts`
- Edge function that generates 8-10 images via Nano Banana Pro
- Stores in `site-assets` bucket with `vendor-landing-*` prefix
- Returns URLs of generated images
- Idempotent — skips if images already exist

### File 2: `src/lib/cdnAssets.ts`
- Add new CDN keys for vendor landing images

### File 3: `src/pages/ForVendors.tsx` (Complete rewrite)
- New section order as outlined above
- Inline pricing cards (adapted from VendorPricing)
- Competitor comparison table
- Tool showcase with AI images
- Early vendor advantage section with scarcity
- All CTAs point to `/vendor/onboarding`
- Fully responsive (grid-cols-1 → md:2 → lg:3/4)
- Hinglish copy for Indian market resonance

### File 4: `src/components/vendor/CompetitorComparison.tsx` (New)
- Clean comparison table: Karlo Shaadi vs WedMeGood vs ShaadiSaga
- Green checkmarks for us, red X for competitors on key features

### File 5: `src/components/vendor/VendorToolShowcase.tsx` (New)
- Visual grid of 6 tools vendors get
- Each card: AI image + title + description + "Free" or plan badge

## Technical Notes
- Edge function uses `google/gemini-3-pro-image-preview` (Nano Banana Pro) for realistic images
- Images generated once, stored permanently in `site-assets` bucket
- Page loads images from CDN (already optimized WebP pipeline)
- All CTAs use `navigate("/vendor/onboarding")` for consistent funnel
- Mobile-first: all grids responsive, text scales properly

