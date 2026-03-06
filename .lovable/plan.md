

## Plan: Complete 6-Tool Vendor Suite with Tier Gating

### Current State
3 of 6 tools already built:
- **VendorCRM.tsx** — Lead pipeline with Kanban, scoring, WhatsApp templates
- **ContractGenerator.tsx** — Category templates, PDF generation, tracking
- **PaymentScheduleManager.tsx** — Milestone scheduling, WhatsApp reminders

### What Needs Building

#### 1. Client Communication Hub (`ClientCommsHub.tsx`)
- Template library: Booking Confirmed, Event Reminder, Day-of Timeline, Thank You + Review Request, Payment Reminder, Seasonal Greetings
- Auto-personalization with `{name}`, `{date}`, `{venue}`, `{vendor}` placeholders
- One-tap copy-to-clipboard or WhatsApp deep link
- Category for template organization (pre-event, day-of, post-event, seasonal)
- Uses existing `vendor_inquiries` + `bookings` data for client list

#### 2. Portfolio Mini-Site Builder (`VendorMiniSite.tsx`)
- Auto-generates a preview of a single-page website from vendor's existing profile data (portfolio, services, reviews)
- Shareable public URL: `/vendor-site/{slug}` route
- Theme selector (2-3 color themes)
- Toggle sections: About, Portfolio Gallery, Services & Pricing, Reviews, WhatsApp CTA
- QR code generation (already have `qrcode` package installed)
- New page: `VendorMiniSitePage.tsx` for the public-facing rendered site

#### 3. Business Intelligence Dashboard (`BusinessIntelligence.tsx`)
- Profile strength score (portfolio count, services, description, logo, response time)
- Pricing comparison vs category average (from `vendor_services` table)
- Monthly inquiry trend chart (from `vendor_inquiries` created_at)
- Response time benchmark vs category average
- Conversion funnel: inquiries → bookings ratio
- Actionable tips generated based on weak areas
- Uses `recharts` (already installed)

### Database Changes
- **`vendor_mini_sites`** table: `id`, `vendor_id`, `slug`, `theme`, `is_published`, `sections_config (jsonb)`, `created_at`, `updated_at`
- **`vendor_message_templates`** table already exists from prior migration — will use it for saved custom templates

### 4. Subscription Tier Gating
Add a `ToolGate` wrapper component that checks vendor's subscription plan before rendering tools:

| Tool | Free | Silver | Gold | Diamond |
|------|------|--------|------|---------|
| CRM | 5 leads | Full | Full | Full |
| Payments | View only | Full | Full | Full |
| Contracts | 1/month | Unlimited | Unlimited | Unlimited |
| Comms | 3 templates | All templates | All + custom | All + custom |
| Mini-Site | No | No | Yes | Yes |
| Intelligence | No | Basic | Full | Full |

- `ToolGate.tsx`: Checks `vendor_subscriptions.plan` and shows upgrade prompt if locked
- Each tool receives `subscriptionPlan` prop and self-limits features accordingly

### 5. Integration into VendorToolkit
Add 3 new tabs: "Comms", "Mini-Site", "Intelligence" to the existing `VendorToolkit.tsx` TabsList.

### Files to Create
- `src/components/vendor/ClientCommsHub.tsx`
- `src/components/vendor/VendorMiniSite.tsx`
- `src/components/vendor/BusinessIntelligence.tsx`
- `src/components/vendor/ToolGate.tsx`
- `src/pages/VendorMiniSitePage.tsx` (public route)

### Files to Edit
- `src/components/vendor/VendorToolkit.tsx` — add 3 new tabs + pass subscription prop
- `src/pages/VendorDashboard.tsx` — pass subscription data to VendorToolkit
- `src/App.tsx` — add `/vendor-site/:slug` route
- Migration for `vendor_mini_sites` table

