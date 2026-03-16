

# iOS 26 Glassmorphic Transformation — Immersive Mobile Experience

## Vision
Transform the entire mobile experience into an iOS 26-inspired liquid glass aesthetic: translucent layered surfaces, deep blur depths, soft luminous borders, fluid animations, and storytelling-driven navigation. Every surface should feel like frosted glass floating over a warm, living background.

## Key Design Changes

### 1. Global Glass Design System (`src/index.css`)
- New CSS variables for glass: `--glass-bg`, `--glass-border`, `--glass-shadow`, `--glass-blur`
- **Liquid Glass Cards**: `background: rgba(255,255,255,0.45)`, `backdrop-filter: blur(40px) saturate(1.8)`, soft inner glow borders using `box-shadow: inset 0 0.5px 0 rgba(255,255,255,0.7)`
- **Living background**: Subtle animated gradient mesh background on `body` for mobile (soft pink/gold/lavender shifting orbs behind all content)
- **Glass tiers**: `.glass-ios` (standard 40px blur), `.glass-ios-thick` (60px blur, more opaque), `.glass-ios-thin` (20px blur, more transparent)
- New animation: `@keyframes meshShift` for background orbs that slowly drift
- Haptic-style press feedback: `active:scale-[0.96]` with spring-like `cubic-bezier(0.34, 1.56, 0.64, 1)` bounce-back

### 2. Bottom Navigation (`src/components/mobile/BottomNavigation.tsx`)
- Frosted glass bar: `bg-white/40 backdrop-blur-[40px] saturate-[1.8]` with top luminous border
- Active tab gets a soft glass pill background with primary tint
- Remove the solid top border, replace with `border-t border-white/30`
- Active indicator: glowing dot under icon instead of top bar
- Smooth icon transitions with slight vertical bounce on tap

### 3. Mobile Page Header (`src/components/mobile/MobilePageHeader.tsx`)
- Glass header: `bg-white/50 backdrop-blur-[40px]` with bottom luminous edge
- Large title style (iOS-inspired): title starts large and shrinks on scroll (CSS only via sticky positioning)
- Back button gets a glass circle background

### 4. Mobile Home Screen (`src/components/mobile/MobileHomeScreen.tsx`) — Full Rewrite
Transform into an immersive storytelling experience:

**Header**: Glass sticky bar with translucent logo, glass search pill, glass notification dot

**Hero**: Full-bleed parallax-style image with glass overlay card floating at bottom containing the tagline and CTA. CTA button gets a glass-pill style with shimmer.

**Category Strip**: Glass-backed circular thumbnails with soft shadow. Horizontal scroll with momentum snap.

**"Your Wedding Story" Section** (NEW): Storytelling section with 3 vertical cards showing the wedding journey — "Dream → Plan → Celebrate" — each card is a glass panel over a wedding image with a one-line story caption. Tapping navigates to relevant tool.

**Vendor Cards**: Glass cards with rounded-2xl, image at top, glass-backed info overlay at bottom. Rating badge floats as a glass pill.

**Planning Tools**: 2x2 grid of glass cards with icon + title. Soft inner glow on active/tap.

**Trust Stats**: Glass pill row instead of bordered grid cards. Each stat is a glass capsule.

**Deals Section**: Glass gradient cards with translucent colored overlays instead of solid gradients.

**How It Works**: Horizontal glass timeline with connecting line and numbered glass circles.

**Reviews**: Glass quote cards with subtle frosted background. Quote mark decorative element.

**Final CTA**: Full-width glass panel with mesh gradient background, floating over the living bg.

### 5. Slide-out Menu (inside MobileHomeScreen)
- Glass panel: `bg-white/60 backdrop-blur-[60px]`
- Menu items become glass list rows with hover/active glass highlight
- Feature cards get glass overlay treatment
- Smooth spring animation on open/close

### 6. Global Touch & Feel Improvements (`src/index.css`)
- All mobile buttons: `active:scale-[0.96]` with spring easing
- All cards: subtle `hover:shadow-lg` replaced with glass glow effect
- Inputs: glass-backed with `bg-white/50 backdrop-blur-xl` on focus
- Page transitions: fade + slight slide-up (200ms)
- Scroll snap on horizontal carousels for momentum feel

## Files to Edit
1. `src/index.css` — Add glass design system, mesh background, animations
2. `src/components/mobile/BottomNavigation.tsx` — Glass tab bar
3. `src/components/mobile/MobilePageHeader.tsx` — Glass header with large title
4. `src/components/mobile/MobileHomeScreen.tsx` — Full glassmorphic storytelling rewrite
5. `src/components/ui/sheet.tsx` — Glass slide-out panel
6. `src/components/GlassCard.tsx` — Updated with iOS glass tiers

## Technical Notes
- No new dependencies needed
- All glass effects use CSS `backdrop-filter` (supported on all modern mobile browsers)
- Performance: `will-change: transform` on animated elements, `contain: layout` on glass surfaces
- Background mesh uses CSS gradients only (no canvas/JS)
- Reduced motion: all animations respect `prefers-reduced-motion`

