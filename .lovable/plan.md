

## Plan: Remove All Dark/Black Styling from Dashboard and ForVendors Pages

### Problem
Two pages (`Dashboard.tsx` and `ForVendors.tsx`) still use a dark theme with `bg-[#0a0a0a]` backgrounds and `text-white` styling throughout, contradicting the site-wide light theme.

### Changes

#### 1. `src/pages/Dashboard.tsx` (full rewrite of styling)
- Change `bg-[#0a0a0a]` to `bg-background`
- Replace all `text-white` → `text-foreground`, `text-white/50` → `text-muted-foreground`, `text-white/40` → `text-muted-foreground`, etc.
- Replace `bg-white/5`, `bg-white/10` glass cards → `bg-white border border-border shadow-sm` (light card style)
- Replace `border-white/10` → `border-border`
- Fix Settings icon color from `text-white/70` → `text-muted-foreground`
- Fix button styles from dark-theme ghost → standard outline buttons
- Remove dark glass container overrides (`[&_*]:!border-white/10`, `[&_.text-foreground]:text-white`, etc.)
- Keep the hero image card with text-white overlay (text on image is fine)

#### 2. `src/pages/ForVendors.tsx` (full rewrite of styling)
- Change `bg-[#0a0a0a]` to `bg-background`
- Replace gradient `from-[#0a0a0a]` → `from-background`
- Replace all section `text-white` headings → `text-foreground`
- Replace `text-white/40`, `text-white/50` → `text-muted-foreground`
- Replace dark glass cards (`bg-white/5 border-white/10`) → `bg-white border-border shadow-sm`
- Replace `border-white/10` section borders → `border-border`
- Icon colors: `text-white/60` → `text-muted-foreground`
- Keep hero section and final CTA image overlays with white text (text on images is expected)
- Fix buttons: `bg-white text-black` → `bg-primary text-primary-foreground`; ghost buttons to standard outline

Both pages will match the site-wide light theme with white backgrounds, proper foreground text colors, and bordered cards.

