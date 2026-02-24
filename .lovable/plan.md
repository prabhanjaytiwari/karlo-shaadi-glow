

# Build Plan: Vendor Profile Setup Service + AI Wedding Speech Writer

Two new features that add a revenue stream (₹999 vendor profile setup) and a viral free tool (AI Speech Writer).

---

## Feature 1: Vendor Profile Setup Service (₹999)

A landing page at `/vendor-profile-setup` where vendors pay ₹999 to have their profile professionally created by the Karlo Shaadi team.

### What gets built:

**1. New Page: `src/pages/VendorProfileSetup.tsx`**
- Hero section explaining the service: "We'll build your profile FOR you"
- What's included:
  - Professional business description written by our team
  - Portfolio upload and arrangement (up to 20 photos)
  - SEO-optimized profile for city-based search
  - Category and service listing setup
  - WhatsApp and contact info configuration
- Pricing card: ₹999 one-time (crossed-out ₹2,999 for urgency)
- Testimonials from vendors who got leads after setup
- Simple form: Name, Phone, Business Name, Category, City, Instagram Handle
- Razorpay payment button (₹999) using existing `create-payment` edge function
- After payment: form data saved to a new `vendor_setup_orders` database table, confirmation screen

**2. New Database Table: `vendor_setup_orders`**
```text
vendor_setup_orders
- id (uuid, PK)
- user_id (uuid, nullable - may not be signed in)
- name (text)
- phone (text)
- business_name (text)
- category (text)
- city (text)
- instagram_handle (text, nullable)
- notes (text, nullable)
- razorpay_payment_id (text, nullable)
- amount (numeric, default 999)
- status (text, default 'paid') -- paid, in_progress, completed
- created_at (timestamptz)
- completed_at (timestamptz, nullable)
```
- RLS: Public INSERT (payment verified server-side), Admin SELECT/UPDATE for managing orders

**3. Route Addition in `App.tsx`**
- Public route: `/vendor-profile-setup`

**4. Admin View (optional stretch)**
- A simple section in the existing Admin Dashboard showing pending setup orders

---

## Feature 2: AI Wedding Speech Writer

A free viral tool at `/speech-writer` where users input details and get a personalized wedding speech. Uses Lovable AI (Gemini) via a new edge function.

### What gets built:

**1. New Edge Function: `supabase/functions/generate-wedding-speech/index.ts`**
- Accepts: relationship to couple, couple names, anecdotes, tone (funny/emotional/balanced), language preference (English/Hindi/Hinglish), speech length (short/medium/long)
- Uses Lovable AI Gateway (`google/gemini-3-flash-preview`) with a detailed system prompt for Indian wedding context
- Returns the generated speech text
- No auth required (free viral tool)
- Handles 429/402 rate limit errors gracefully

**2. New Component: `src/components/SpeechWriter.tsx`**
- Step 1 - Input Form:
  - "Who are you?" dropdown: Best Man, Maid of Honor, Father of Bride, Mother of Groom, Sibling, Friend, Colleague, Other
  - Couple names (bride + groom)
  - 3-5 anecdote text fields: "Share a funny/sweet memory" with placeholder examples
  - Tone selector: Funny & Sarcastic / Emotional & Heartfelt / Balanced Mix
  - Language: English / Hindi / Hinglish
  - Length: Short (1 min) / Medium (3 min) / Long (5 min)
- Step 2 - Generated Speech:
  - Formatted speech with sections highlighted
  - "Copy to Clipboard" button
  - "Share on WhatsApp" button (pre-filled message with Karlo Shaadi link)
  - "Regenerate" button
  - "Download as PDF" button (using existing jspdf dependency)
  - Subtle Karlo Shaadi branding: "Speech crafted by AI on KarloShaadi.com"

**3. New Page: `src/pages/SpeechWriterPage.tsx`**
- SEO-optimized wrapper with header/footer
- Title: "AI Wedding Speech Writer - Free Personalized Speeches"
- Keywords targeting: "wedding speech for best man", "shaadi speech in hindi", etc.

**4. Config updates:**
- Add `[functions.generate-wedding-speech]` with `verify_jwt = false` to `supabase/config.toml`
- Add route `/speech-writer` to `App.tsx`

---

## Technical Details

### Files to Create (5 new files):
1. `src/pages/VendorProfileSetup.tsx` - Setup service landing page with payment
2. `src/pages/SpeechWriterPage.tsx` - Speech writer page wrapper
3. `src/components/SpeechWriter.tsx` - Speech writer component with form + output
4. `supabase/functions/generate-wedding-speech/index.ts` - AI speech generation edge function

### Files to Modify (2 files):
1. `src/App.tsx` - Add two new routes
2. `supabase/config.toml` - Add speech function config

### Database Migration (1 table):
- Create `vendor_setup_orders` table with RLS policies

### Payment Flow (Vendor Setup):
Uses existing `create-payment` and `verify-payment` edge functions with Razorpay live keys already configured.

### AI Integration (Speech Writer):
Uses `LOVABLE_API_KEY` (already configured) with `google/gemini-3-flash-preview` model. No new API keys needed.

