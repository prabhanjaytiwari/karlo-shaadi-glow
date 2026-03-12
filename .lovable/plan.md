

# Vendor Registration Redesign

## Current Problems
- Category selection is a plain dropdown -- vendors don't feel connected to their identity
- Too many fields packed into 3 generic steps with no visual hierarchy
- No motivational copy between steps; feels like a government form
- WhatsApp number requires manual re-entry (most Indian vendors use the same number)
- Description field is intimidating with no AI help or templates
- No visual progress indicators with step names
- Mobile layout doesn't feel native

## Redesign: 5-Step Guided Onboarding

### Step 1: "Choose Your Category" (Visual Grid)
- Large icon cards in a responsive grid (instead of dropdown)
- Each card shows category name + icon + short tagline
- Single-tap selection with animated highlight
- Trust line: "Join 10,000+ vendors already on Karlo Shaadi"

### Step 2: "Your Business Identity"
- Business name, city (dropdown), years of experience
- Starting price with pre-filled suggestions based on category
- Gender preference (only for relevant categories like makeup/mehendi)
- Clean 2-column layout on desktop, stacked on mobile

### Step 3: "Tell Your Story"
- Business description with AI-generated template button ("Write for me")
- Pre-fills a starter description based on category + city + experience
- Character counter with encouraging copy
- Team size field

### Step 4: "Contact & Social"
- Phone number with "Same for WhatsApp" checkbox (auto-copies)
- WhatsApp number (pre-filled if checkbox checked)
- Instagram handle, Facebook page, Google Maps link, website
- Address field
- Business logo upload with drag-drop

### Step 5: "Review & Submit"
- Summary card showing all entered info organized neatly
- Edit buttons next to each section to jump back
- "Complete Registration" CTA with confetti animation on success
- Trust signals: Free, No commission, Verified in 24-48hrs

## UX Improvements
- Named progress stepper with icons (not just a percentage bar)
- Each step has a motivational subheading
- "Back" and "Continue" buttons are always visible and sticky on mobile
- Auto-save form data to localStorage so vendors don't lose progress on refresh
- Smooth slide transitions between steps using framer-motion

## Technical Changes
- **File**: `src/pages/VendorOnboarding.tsx` -- complete rewrite
- No database changes needed (same insert schema)
- No new dependencies needed (framer-motion already installed)

