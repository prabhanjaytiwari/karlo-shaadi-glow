

# Vendor Onboarding: Immersive Indian Wedding Experience

## What We're Building

A complete rewrite of `VendorOnboarding.tsx` into a **6-step cinematic onboarding wizard** with glassmorphism, AI-generated hero illustrations per step, storytelling flow, and a final subscription upsell step with a "Skip — Stay Free" option.

## Step Flow

```text
┌─────────────────────────────────────────────────┐
│ Step 1: "Apka Kaam, Apki Pehchaan"             │
│ (Your Work, Your Identity)                       │
│ → Visual category grid with glass cards          │
│ → AI-generated hero: wedding mandap scene        │
├─────────────────────────────────────────────────┤
│ Step 2: "Apna Business Batao"                   │
│ (Tell Us About Your Business)                    │
│ → Name, city, experience, pricing               │
│ → AI hero: bustling Indian wedding market        │
├─────────────────────────────────────────────────┤
│ Step 3: "Apni Kahani Sunao"                     │
│ (Tell Your Story)                                │
│ → Description + AI write-for-me + team size     │
│ → AI hero: artisan crafting decorations          │
├─────────────────────────────────────────────────┤
│ Step 4: "Jude Rahiye"                           │
│ (Stay Connected)                                 │
│ → Phone, WhatsApp sync, socials, logo upload    │
│ → AI hero: vendor connecting with couple         │
├─────────────────────────────────────────────────┤
│ Step 5: "Sab Sahi Hai?"                         │
│ (Everything Look Good?)                          │
│ → Review summary with edit shortcuts            │
│ → Submits vendor profile on "Complete"          │
├─────────────────────────────────────────────────┤
│ Step 6: "Apna Plan Chuniye"                     │
│ (Choose Your Plan)                               │
│ → 3 subscription cards (Silver/Gold/Diamond)    │
│ → "Skip — Continue with Free" button            │
│ → Razorpay checkout if paid plan selected       │
│ → AI hero: vendor receiving trophy/crown        │
└─────────────────────────────────────────────────┘
```

## Visual Design

- **Glassmorphism containers**: `bg-white/10 backdrop-blur-xl border border-white/20` for all step cards
- **Glossy gradient backgrounds**: Each step gets a unique soft gradient (rose→amber, amber→emerald, etc.)
- **AI Hero Images**: Generated via Nano Banana Pro edge function, cached in `home-banners` storage bucket. One cinematic Indian wedding illustration per step, displayed as a full-width banner above the step content.
- **Floating decorative elements**: Subtle animated mandala SVG patterns and floating gold particles using framer-motion
- **Progress stepper**: Horizontal glass pill stepper with step names in Hindi/English, golden line connectors
- **Storytelling headings**: Each step has a Hindi tagline + English subtitle for emotional connection

## Step 6: Subscription Upsell (New)

After profile creation (Step 5 submits the vendor), Step 6 shows:
- Three glassmorphic plan cards (Silver ₹4,999, Gold ₹9,999, Diamond ₹19,999) with 50% first-month discount
- Feature comparison with check/cross icons
- "Most Popular" badge on Gold
- **"Skip — Continue with Free Plan →"** button at the bottom (navigates to dashboard)
- Selecting a paid plan opens `VendorSubscriptionCheckout` dialog with Razorpay
- Trust signals: "100% money-back guarantee", "Cancel anytime"

## AI Image Generation

A new edge function `generate-onboarding-images` will:
1. Use Nano Banana Pro (`google/gemini-3-pro-image-preview`) to generate 6 cinematic Indian wedding illustrations
2. Upload to `home-banners` bucket with keys like `onboarding-step-1.png`
3. Cache check — skip generation if images already exist
4. Called once on first load, images served from storage thereafter

Prompts will be specific to Indian weddings:
- Step 1: "Cinematic illustration of a grand Indian wedding mandap with marigold garlands and warm golden lighting"
- Step 2: "Illustration of a busy Indian wedding marketplace with colorful stalls and happy vendors"
- Step 3: "Artisan hands creating beautiful Indian wedding decorations with flowers and fabric"
- Step 4: "Indian wedding vendor warmly greeting a couple in traditional attire"
- Step 5: "Beautiful Indian wedding checklist with golden check marks and rose petals"
- Step 6: "Indian wedding vendor receiving a golden crown and trophy, celebration"

## Technical Changes

### Files Modified
- **`src/pages/VendorOnboarding.tsx`** — Complete rewrite with 6 steps, glassmorphism, AI images, subscription step
- **`supabase/functions/generate-onboarding-images/index.ts`** — New edge function for AI image generation and caching

### Wiring
- Step 5 `handleSubmit` creates vendor profile (existing logic preserved)
- On success, auto-advances to Step 6 (subscription)
- Step 6 "Skip" → navigates to `/vendor/dashboard`
- Step 6 paid plan → opens `VendorSubscriptionCheckout` dialog → on success navigates to dashboard
- Form data still persisted in localStorage
- All existing validation schemas preserved

### No Database Changes
Same vendor table insert schema. Subscription handled by existing `VendorSubscriptionCheckout` + `vendor_subscriptions` table.

