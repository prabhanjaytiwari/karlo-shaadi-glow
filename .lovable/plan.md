

## Plan: Standardize Design System Across Entire Website

### Problem
The website has accumulated inconsistent sizing, typography, spacing, and button styles across pages and sections — a hallmark of AI-generated code where each section was built independently. Key issues:

- **Section padding varies wildly**: `py-8`, `py-10`, `py-12`, `py-14`, `py-16`, `py-20`, `py-24`, `py-28` used interchangeably
- **Heading sizes are inconsistent**: `text-2xl md:text-3xl`, `text-3xl md:text-5xl`, `text-4xl md:text-6xl` — no standard hierarchy
- **Button sizes/styles differ per section**: Some use `size="lg"`, others `size="default"`, `size="sm"`, with mixed `rounded-full`, `px-8`, `px-10`, `py-6` overrides
- **Section label badges differ**: Some use `rounded-full`, others `rounded-lg`; different padding, border styles, font sizes
- **Font weight keywords vary**: `font-bold` vs `font-semibold` used inconsistently for same heading levels
- **Container max-widths differ**: `max-w-3xl`, `max-w-4xl`, `max-w-5xl`, `max-w-6xl`, `max-w-7xl` with no pattern

### Solution: Establish and Enforce a Standard

**Standard Section Rhythm** (apply everywhere):
- Section padding: `py-16 md:py-24` (one size for all content sections)
- Section label badge: `inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium`
- Container: `container mx-auto px-4 sm:px-6`

**Standard Heading Hierarchy**:
- h1 (page hero): `text-3xl md:text-5xl font-semibold`
- h2 (section title): `text-2xl md:text-3xl font-semibold`
- h3 (card/sub-section): `text-lg font-semibold`
- Body text: `text-sm sm:text-base text-muted-foreground`

**Standard Button Patterns**:
- Primary CTA: `size="lg" className="rounded-full px-8"`
- Secondary CTA: `size="lg" variant="outline" className="rounded-full px-8"`
- In-section link: `size="default" className="rounded-full px-6"`
- Remove all custom `py-6`, `text-lg`, `px-10` overrides

**Standard Divider**:
- Use `w-16 h-0.5 bg-gradient-to-r from-primary/30 via-primary to-primary/30 mx-auto rounded-full` (or accent variant) consistently

---

### Files to Edit

1. **`src/pages/Index.tsx`** (~522 lines)
   - Standardize all 8+ section paddings to `py-16 md:py-24`
   - Normalize heading sizes: h2s all become `text-2xl md:text-3xl font-semibold`
   - Standardize all section label badges to same pattern
   - Normalize all Button sizes (remove `text-lg px-10 py-6` overrides from Final CTA)
   - Standardize container max-widths to `max-w-5xl` for content sections

2. **`src/components/TensionsSection.tsx`**
   - Normalize h2 from `text-3xl sm:text-4xl md:text-5xl` to `text-2xl md:text-3xl`
   - Standardize section padding and badge style

3. **`src/components/BentoGrid.tsx`**
   - Standardize section padding
   - Normalize badge and heading sizes

4. **`src/components/ReviewsSection.tsx`**
   - Section padding from `py-24` to `py-16 md:py-24`
   - Standardize badge and heading

5. **`src/components/TrustStatsBanner.tsx`**
   - Standardize padding

6. **`src/pages/EarnWithUs.tsx`**
   - h1 from `text-4xl md:text-6xl` to `text-3xl md:text-5xl`
   - All h2s to `text-2xl md:text-3xl`
   - Standardize section paddings, badge style

7. **`src/pages/ForVendors.tsx`**
   - Standardize hero heading, section paddings, button sizes

8. **`src/pages/SpeechWriterPage.tsx`**
   - Standardize hero heading and section padding

9. **`src/pages/BudgetCalculatorPage.tsx`**
   - Ensure consistent spacing pattern

10. **`src/components/SponsoredVendorsCarousel.tsx`**
    - Standardize section padding and heading size

11. **`src/components/LiveActivityFeed.tsx`**
    - Standardize padding and heading

12. **`src/pages/WhyKarloShaadi.tsx`**
    - Normalize heading sizes from `text-3xl md:text-5xl` to standard
    - Standardize section paddings

13. **`src/pages/MusicGenerator.tsx`**
    - h1 from `text-4xl md:text-6xl` to `text-3xl md:text-5xl`

### Scope Boundaries
- This plan does NOT change colors, gradients, or the design language
- This plan does NOT touch component library files (ui/button.tsx etc.)
- This is purely about making sizes, spacing, and typography uniform across pages
- Wedding website builder (`WeddingWebsite.tsx`, `WeddingView.tsx`) excluded as those are user-facing customizable templates

### Technical Notes
- No database changes needed
- No new dependencies
- Purely CSS class standardization across ~13 files
- All changes are visual consistency fixes following the existing design system values

