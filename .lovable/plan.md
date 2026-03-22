

# Immersive Auth, Splash & Vendor Onboarding Redesign

## What This Covers

1. **Separate splash screens** for couples (romantic/soft) vs vendors (professional/bold)
2. **Couple auth page** redesigned with reference-image aesthetics — glassmorphism cards, smooth animations
3. **Vendor onboarding** completely restyled with the same premium design language, skip-to-end option, pricing step with congratulations flow
4. **Proper wiring** — redirects, subscription confirmation, congratulations screen
5. **AI-generated hero images** via Nano Banana Pro for splash/auth backgrounds

---

## Files to Create/Modify

### 1. Splash Screen — Role-Aware (`src/components/native/SplashScreen.tsx`)

Currently shows one generic splash. Change to detect the current route:
- **Couple routes** (`/`, `/auth`, `/dashboard`): Soft romantic gradient (rose/lavender), heart icon, tagline "Your Dream Wedding, Simplified"
- **Vendor routes** (`/vendor/*`, `/vendor-auth`): Bold dark gradient (deep purple → gold), briefcase/crown icon, tagline "Grow Your Wedding Business"
- Use `useLocation()` to determine which splash to show
- Both get smooth scale-in logo + fade-in text + loading dots animation

### 2. Couple Onboarding (`src/pages/Onboarding.tsx`)

Redesign the 4-slide carousel to match reference images:
- Remove emoji orb clusters — replace with clean illustration cards (AI-generated wedding images stored in Supabase)
- Glassmorphism slide container: `bg-white/20 backdrop-blur-xl border border-white/20 rounded-3xl`
- Smooth spring animations on slide transitions
- Clean dot indicators + large rounded CTA button
- Keep Skip button

### 3. Couple Auth Page (`src/pages/Auth.tsx`)

Redesign to match reference aesthetics:
- **Mobile**: Full-bleed hero image (AI-generated romantic mandap scene) with gradient overlay, glassmorphism auth card floating over it
- **Desktop**: Split layout stays but left panel gets AI-generated cinematic image with glassmorphism stat overlay
- Auth card: `bg-white/80 backdrop-blur-2xl border border-white/30 shadow-2xl rounded-3xl`
- Inputs: frosted glass style with soft focus rings
- Google button: clean with subtle shadow
- Smooth entrance animations (staggered fade-in for form fields)
- Vendor CTA section: clean card with gradient accent border

### 4. Vendor Auth Page (`src/pages/VendorAuth.tsx`)

Match the vendor onboarding dark theme:
- Dark background with subtle gold accent orbs
- Glassmorphism login card: `bg-white/[0.08] backdrop-blur-xl border border-white/[0.15] rounded-3xl`
- Gold accent CTA buttons
- "New vendor? Register here →" prominently linked to `/vendor/onboarding`

### 5. Vendor Onboarding Complete Redesign (`src/pages/VendorOnboarding.tsx`)

This is the largest change — 1306 lines, needs visual overhaul:

**Step 0 (Auth)**:
- Dark cinematic background with AI-generated vendor hero image
- Glassmorphism signup card with gold accents
- Smooth entrance animations

**Steps 1-5 (Profile Creation)**:
- **Skip button** added: "Skip to Quick Setup →" that jumps to Step 5 (Review) with only required fields (category + business name + city) pre-filled or prompted in a compact form
- Step hero banners: keep existing images but add glassmorphism overlay with step info
- Progress stepper: redesigned as a sleek pill-based horizontal stepper with glow on active step
- Form containers: glassmorphism cards with smooth field-by-field fade-in
- Category grid (Step 1): cards with subtle 3D tilt on hover (transform: perspective + rotateX)
- Navigation: sticky bottom bar with glassmorphism effect

**Step 6 (Pricing/Plan Selection)**:
- Redesigned to match the uploaded pricing reference images
- 3 plan cards with the "Pro" card elevated/inverted (dark bg with gold accent)
- Clean feature comparison with checkmarks
- "Skip — Continue Free" button clearly visible

**Step 7 (NEW — Congratulations Screen)**:
- After subscription payment OR free plan selection
- Full-screen celebration: confetti animation, large checkmark, "Welcome to Karlo Shaadi! 🎉"
- Show subscription tier badge if paid
- Auto-redirect to `/vendor/dashboard` after 3 seconds OR manual "Go to Dashboard" button
- AI-generated congratulations illustration

### 6. AI Image Generation

Generate 4 images via Nano Banana Pro edge function for:
1. Couple auth hero — romantic mandap/wedding ceremony scene
2. Vendor auth hero — professional wedding business scene
3. Couple splash background — soft floral wedding aesthetic
4. Congratulations illustration — celebration/success themed

Store in `home-banners` Supabase bucket (existing infrastructure).

### 7. Subscription Wiring Fix

- `VendorSubscriptionCheckout` component's `onSuccess` callback currently navigates directly to dashboard
- Change: `onSuccess` → set a `subscriptionComplete` state → show congratulations screen (Step 7) → then navigate
- Ensure the congratulations screen shows the correct plan name and badge

---

## Technical Details

### Glassmorphism Pattern (Consistent)
```css
/* Light context (couple) */
bg-white/70 backdrop-blur-2xl border border-white/30 shadow-2xl rounded-3xl

/* Dark context (vendor) */
bg-white/[0.08] backdrop-blur-xl border border-white/[0.15] shadow-2xl rounded-3xl
```

### Skip Feature Logic
When vendor clicks "Skip to Quick Setup":
- Jump to a condensed form showing only: Category dropdown + Business Name + City
- On submit → create vendor profile with minimal data → show Step 6 (pricing)
- All other fields default to null/empty (can be filled later from dashboard)

### Animation System
- Page transitions: `framer-motion` with custom spring configs
- Form fields: staggered `y: 20 → 0` with 50ms delay between fields
- Cards: `whileHover={{ y: -4, shadow: '...' }}` for depth
- Congratulations: confetti via CSS keyframes + scale-in checkmark

### Files Modified
1. `src/components/native/SplashScreen.tsx` — role-aware splash
2. `src/pages/Onboarding.tsx` — couple onboarding redesign
3. `src/pages/Auth.tsx` — couple auth glassmorphism redesign
4. `src/pages/VendorAuth.tsx` — vendor auth dark theme
5. `src/pages/VendorOnboarding.tsx` — complete visual overhaul + skip + congratulations
6. Edge function call for AI image generation (existing `generate-home-banners`)

### Redirect Wiring
- Couple signup → email verify → `/auth` → role check → `/dashboard`
- Vendor signup (onboarding) → email verify → `/vendor/onboarding` → continue steps
- Vendor subscription success → congratulations screen → `/vendor/dashboard`
- Free plan skip → congratulations screen (simpler) → `/vendor/dashboard`

