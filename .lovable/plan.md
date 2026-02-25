

# Mobile App UI/UX -- Missing Pages & Screens Audit

## Current State

You already have **75+ pages** covering core flows: Auth, Dashboard, Search, Bookings, Messages, Profile, Settings, Vendor flows, and tools. You also have bottom navigation, safe-area handling, splash screen, and deep linking infrastructure.

## What's Missing for a Polished Mobile App

Here are the screens/pages that professional mobile apps have but Karlo Shaadi currently lacks, grouped by priority:

---

### Priority 1: First-Time User Experience (Critical for Retention)

**1. Onboarding Walkthrough (3-4 swipeable slides)**
- First-time users see a swipeable intro: "Find vendors", "Plan your wedding", "Book with confidence"
- Uses `localStorage` to show only once
- Ends with "Get Started" button leading to Auth or Home
- This is the #1 thing that separates amateur apps from polished ones

**2. Empty States for Core Screens**
- Currently, Bookings/Messages/Favorites show generic empty states
- Mobile apps need rich, illustrated empty states with clear CTAs
- Example: Messages empty state = illustration + "Start a conversation with a vendor"

---

### Priority 2: Essential Mobile Screens

**3. Notifications Page (`/notifications`)**
- Dedicated full-screen notification center (booking updates, messages, deals)
- Currently `NotificationCenter` exists as a dropdown, but mobile needs a full page
- Replaces the bell icon dropdown on mobile with a dedicated screen

**4. QR Code / Share Profile Screen**
- Let couples share their wedding website or referral via QR code
- Vendors can show their QR at events for instant profile access
- Uses the already-installed `qrcode` package

**5. Offline / No Connection Screen**
- A branded "You're offline" screen instead of browser default errors
- Shows cached content or a retry button
- Critical for Indian wedding venues with spotty wifi

---

### Priority 3: Polish & Delight

**6. App Update / What's New Screen**
- A "What's New" modal after app updates highlighting new features
- Drives feature discovery for returning users
- Version tracked in `localStorage`

**7. Image Viewer / Gallery Lightbox**
- Full-screen swipeable image viewer for vendor portfolios
- Pinch-to-zoom, swipe to dismiss
- Currently vendor photos just open in cards, no immersive view

**8. Feedback / Rate App Screen**
- After 5th booking view or 3rd session, prompt "Enjoying Karlo Shaadi?"
- Links to app store rating or in-app feedback form
- Drives app store ranking

---

### Priority 4: Trust & Safety (Nice to Have)

**9. Verification / KYC Screen for Couples**
- Phone number verification via OTP (builds trust with vendors)
- Optional Aadhaar/ID upload for premium features

**10. Report / Block Screen**
- Report a vendor or inappropriate content
- Block a user from messaging

---

## Technical Approach

| Screen | New File | Key Libraries |
|---|---|---|
| Onboarding Walkthrough | `src/pages/Onboarding.tsx` | `embla-carousel-react` (already installed) |
| Notifications Page | `src/pages/Notifications.tsx` | Existing notification components |
| Offline Screen | `src/components/OfflineScreen.tsx` | `navigator.onLine` API |
| QR Share | `src/components/QRShareSheet.tsx` | `qrcode` (already installed) |
| Image Lightbox | `src/components/ImageLightbox.tsx` | `framer-motion` (already installed) |
| What's New | `src/components/WhatsNewModal.tsx` | `localStorage` + Dialog |
| Rate App | `src/components/RateAppPrompt.tsx` | `localStorage` session counter |
| Feedback | `src/pages/Feedback.tsx` | Database table for submissions |

All dependencies are already installed -- no new packages needed.

## Recommended Build Order

1. Onboarding Walkthrough (biggest impact on first-time retention)
2. Notifications Page (completes bottom nav experience)
3. Offline Screen (essential for Indian market)
4. Image Lightbox (vendor portfolio UX upgrade)
5. QR Share + Rate App + What's New (polish layer)

