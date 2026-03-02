
# Mobile Home Screen -- Premium Overhaul

## Problems Identified

1. **Category row mixes tools with vendor categories** -- Budget Calculator and Photographer sit side by side in the same circular icon row, which makes no sense
2. **Missing tagline** -- "Aap Shaadi Karo, Tension Hum Sambhal Lenge" and "India's Most Trending Wedding Planning Platform" are nowhere visible
3. **Sections feel repetitive/unstructured** -- Two separate "Planning Tools" sections, vendor grid and vendor cards look similar, no clear visual hierarchy
4. **Missing desktop sections on mobile** -- No BentoGrid equivalent, no Reviews/Testimonials carousel, no Live Activity Feed, no AI Matchmaking entry point
5. **Links don't feel purposeful** -- Viral tools row looks like random pills, "See All" links sometimes go to wrong places
6. **No premium polish** -- Everything uses the same card border style, no visual variety, no generated imagery to add richness

---

## Redesign Structure (Top to Bottom)

The new home screen will have **12 distinct, well-separated sections** with clear visual hierarchy. Each section has a single purpose.

### Section 1: Sticky Header (keep existing)
Logo + notification bell, no changes needed.

### Section 2: Hero Banner (redesign)
- Full-width card with existing `hero-wedding-phere.jpeg`
- **Tagline overlay**: "Aap Shaadi Karo, Tension Hum Sambhal Lenge" (always visible, not just for logged-in)
- **Subtitle**: "India's Most Trending Wedding Planning Platform"
- **CTA**: "Start Planning Free" linking to `/plan-wizard`
- Wedding countdown strip below (if logged-in with date set)

### Section 3: Trust Stats Strip (keep, refine spacing)
4-column grid -- 500+ Couples, 50+ Vendors, 100% Secure, 20+ Cities. Slightly larger icons, better spacing.

### Section 4: Vendor Categories (NEW -- separate from tools)
- **Header**: "Browse by Category" + "See All" -> `/categories`
- 2-row horizontal scroll of **vendor categories only**: Venue, Photography, Decoration, Makeup, Catering, Mehendi, Music, Jewelry, Entertainment
- Circular image thumbnails using existing `category-*.jpg` assets
- Each links to `/search?category=X`

### Section 5: Top Vendors (keep, polish)
- **Header**: "Top Rated Vendors" + "See All" -> `/search`
- Horizontal scroll of vendor cards (from DB or placeholders)
- Slightly wider cards (w-40), better image aspect ratio

### Section 6: Free Planning Tools (NEW -- completely separate section)
- **Header**: "Free Planning Tools" + "See All" -> `/budget-calculator`
- 2x2 grid of tool cards (not circular icons, not pills):
  - Budget Calculator (Calculator icon, -> `/budget-calculator`)
  - Muhurat Finder (Calendar icon, -> `/muhurat-finder`)
  - Invite Creator (Heart icon, -> `/invite-creator`)
  - Wedding Planner (Sparkles icon, -> `/plan-wizard`)
- Each card: icon + title + one-line description + subtle gradient bg

### Section 7: Fun Wedding Tools (replaces "Viral Tools Row")
- **Header**: "Fun Wedding Tools"
- Horizontal scroll of **image cards** (not pills) -- each with a generated banner image from Nano Banana Pro
- Cards: Couple Quiz, Budget Roast, Speech Writer, Music Generator, Vendor Score Checker
- Each card: generated image (top), title + short tagline (bottom)
- **5 images generated** via edge function using `google/gemini-3-pro-image-preview`

### Section 8: How It Works (keep, compact)
3 numbered steps in a vertical stack. No changes except consistent spacing.

### Section 9: Shaadi Seva (keep, minor polish)
Social impact card. Keep as-is with minor margin fixes.

### Section 10: Success Stories + Reviews (combine into one section)
- Top: Image card with "Real Couples, Real Celebrations" overlay
- Below: 4.9/5 rating badge + "Read Their Stories" CTA
- Below that: horizontal scroll of 2-3 review quotes (hardcoded)

### Section 11: For Vendors Banner (keep, polish)
Vendor acquisition with fireworks image. Keep structure, fix spacing.

### Section 12: Final CTA + Vendor Registration (combine)
Single closing section with "Start Your Dream Wedding" CTA and a secondary "Are You a Vendor?" strip below.

---

## Image Generation via Edge Function

Create a new edge function `generate-home-banners` that uses **Nano Banana Pro** (`google/gemini-3-pro-image-preview`) to generate 5 card banner images for the "Fun Wedding Tools" section. Images are generated once and stored in Supabase Storage (`home-banners` bucket).

The MobileHomeScreen will check if images exist in storage first; if not, it triggers generation. This avoids re-generating on every load.

**Prompts for 5 images:**
1. "Couple Quiz" -- Playful Indian couple silhouette with hearts, warm rose/gold tones, minimal illustration style
2. "Budget Roast" -- Humorous wedding budget with flames, Indian wedding gold/red theme, flat illustration
3. "Speech Writer" -- Elegant microphone with wedding flowers, warm tones, minimal design
4. "Music Generator" -- Musical notes with Indian wedding instruments, rose gold palette, minimal illustration
5. "Vendor Score" -- Checkmark badge with wedding motifs, gold/amber tones, premium feel

Each image: 400x200px landscape, stored as PNG in `home-banners` bucket.

---

## Files to Change

| File | Action |
|------|--------|
| `src/components/mobile/MobileHomeScreen.tsx` | **Rewrite** -- Complete restructure with 12 clean sections |
| `supabase/functions/generate-home-banners/index.ts` | **Create** -- Edge function for Nano Banana Pro image generation |

## No other files change
Bottom navigation, FAB, Index.tsx routing -- all stay the same.

---

## Technical Details

### MobileHomeScreen.tsx Structure

```text
Header (sticky)
  |
Hero Banner (tagline always visible)
  |
Trust Stats (4-col grid)
  |
Browse by Category (horizontal scroll, vendor categories ONLY)
  |
Top Rated Vendors (horizontal scroll, DB query)
  |
Free Planning Tools (2x2 grid, tools ONLY)
  |
Fun Wedding Tools (horizontal scroll, generated images)
  |
How It Works (3 steps)
  |
Shaadi Seva (impact card)
  |
Success Stories + Reviews (image + rating + quotes)
  |
For Vendors (acquisition banner)
  |
Final CTA (dream wedding + vendor registration)
```

### Edge Function: `generate-home-banners`

- Uses `google/gemini-3-pro-image-preview` model via Lovable AI gateway
- Generates 5 images with specific prompts
- Uploads to Supabase Storage bucket `home-banners`
- Returns public URLs
- Called once; MobileHomeScreen checks storage first before calling

### Category Data (separated from tools)

```typescript
const vendorCategories = [
  { image: categoryVenue, label: 'Venue', category: 'venue' },
  { image: categoryPhotography, label: 'Photography', category: 'photography' },
  { image: categoryDecoration, label: 'Decoration', category: 'decoration' },
  { image: categoryMakeup, label: 'Makeup', category: 'makeup' },
  { image: categoryCatering, label: 'Catering', category: 'catering' },
  { image: categoryMehendi, label: 'Mehendi', category: 'mehendi' },
  { image: categoryMusic, label: 'Music', category: 'music' },
  { image: categoryJewelry, label: 'Jewelry', category: 'jewelry' },
];
```

### Premium Design Touches
- Section dividers using `divider-premium` gradient lines between major sections
- Gold accent borders on the hero card
- Staggered fade-in animations on section entry
- Consistent `space-y-8` between sections (increased from `space-y-6`)
- Review quotes in a premium glassmorphism card style
