

# App-Wide Polish: Alignment, Spacing, and Typography Consistency

## Problems Identified

After reviewing 15+ pages and key components, here are the inconsistencies:

1. **Desktop top padding**: Pages use `pt-20`, `pt-24`, or nothing — should be consistent `pt-20` (matches header height)
2. **Mobile bottom padding**: Varies between `pb-20`, `pb-24`, `pb-28` — should be `pb-24` (bottom nav clearance)
3. **Container padding**: Mix of `px-4`, `px-6`, `px-4 sm:px-6` — standardize to `px-4 md:px-6`
4. **Section vertical spacing**: Ranges from `space-y-5` to `space-y-8` — standardize mobile `space-y-5`, desktop `space-y-8`
5. **Card border radius**: Mix of `rounded-xl` and `rounded-2xl` — standardize to `rounded-2xl`
6. **MobilePageHeader**: `h-12` is tight; content below sometimes has no breathing room
7. **Mobile home screen**: `space-y-5` between sections is fine but some sections use `-mt-1`/`-mt-2` breaking rhythm
8. **Desktop section spacing**: Ranges from `py-16 md:py-24` to `py-16 md:py-20` — standardize to `py-16 md:py-24`
9. **Footer CTA section**: `px-6` differs from pages using `px-4 sm:px-6`
10. **Search page, Categories page, ForVendors page**: Desktop containers use inconsistent `max-w-*` values

## Standardized Design Tokens

```text
Mobile:
  - Page padding:     px-4 py-4 pb-24
  - Section spacing:  space-y-5
  - Header height:    h-14 (increase from h-12)
  - Card radius:      rounded-2xl
  - Card border:      border-border/50

Desktop:
  - Page top:         pt-20
  - Container:        container mx-auto px-4 md:px-6
  - Section spacing:  py-16 md:py-24
  - Content max-w:    max-w-6xl mx-auto (lists), max-w-2xl (forms)
```

## Files to Modify

### Core Layout Components
1. **`src/components/mobile/MobilePageHeader.tsx`** — Increase height from `h-12` to `h-14` for better touch targets and visual breathing
2. **`src/components/BhindiFooter.tsx`** — Standardize container padding to `px-4 md:px-6`

### Mobile Home Screen
3. **`src/components/mobile/MobileHomeScreen.tsx`** — Remove negative margin hacks (`-mt-1`, `-mt-2`), standardize section spacing to `space-y-6`, ensure consistent `px-4` padding

### Key Pages (alignment + spacing fixes)
4. **`src/pages/Dashboard.tsx`** — Standardize mobile padding to `px-4 py-4 pb-24`, desktop to `pt-20`
5. **`src/pages/Bookings.tsx`** — Fix desktop `pt-24` → `pt-20`, ensure consistent card spacing
6. **`src/pages/Profile.tsx`** — Fix desktop `pt-24` → `pt-20`, standardize form card spacing
7. **`src/pages/Categories.tsx`** — Fix desktop `mt-16` → consistent `pt-20`
8. **`src/pages/Auth.tsx`** — Ensure centered card alignment, consistent padding
9. **`src/pages/Search.tsx`** — Standardize container and grid spacing
10. **`src/pages/ForVendors.tsx`** — Fix `pt-20 pb-0` → consistent section spacing
11. **`src/pages/Pricing.tsx`** — Standardize section padding and card alignment
12. **`src/pages/Index.tsx`** — Standardize desktop section spacing to `py-16 md:py-24`, consistent container padding

### Global CSS
13. **`src/index.css`** — Add utility class `.page-container` for consistent page wrapper styling, ensuring all pages use the same base alignment

## Approach
- Systematic file-by-file pass applying the standardized tokens
- No visual redesign — purely alignment, margins, and spacing normalization
- All changes preserve existing responsive breakpoints and mobile-first approach

