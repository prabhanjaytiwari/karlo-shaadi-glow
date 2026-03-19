

# Remaining Issues Fix Plan

## Issue 1 — Vendor Portfolio Storage Hardening

**Current state**: The `vendor-portfolio` bucket already has:
- Auth required for uploads (INSERT policy checks `auth.uid()`)
- Mime types restricted to `image/jpeg, image/jpg, image/png, image/webp`
- File size limit: **5MB**

**Change needed**: Increase file size limit from 5MB to 10MB via a migration:
```sql
UPDATE storage.buckets 
SET file_size_limit = 10485760 
WHERE id = 'vendor-portfolio';
```

Also update the client-side `maxSize` in `BulkPortfolioUpload.tsx` (line 34: `5242880`) and `PortfolioUploadEnhanced.tsx` (line 89: `5242880`) to `10485760` (10MB), and update the UI text "5MB" → "10MB".

## Issue 2 — Pricing Page Verification

**Already correct** — no changes needed:
- `VendorPricing.tsx`: Free ₹0 (15% fee), Silver ₹4,999, Gold ₹9,999, Diamond ₹19,999
- All paid plans show "100% money-back if no 3 leads in 30 days"
- Couple `Pricing.tsx`: Free ₹0, AI Premium ₹999 with 30-day money-back guarantee

## Issue 3 — Build Error Check

Will verify no TypeScript/build errors exist by checking console logs and current app state. If errors surface during implementation, they'll be fixed inline.

## Summary

| # | File(s) | Change |
|---|---------|--------|
| 1 | Migration SQL | Update vendor-portfolio bucket size to 10MB |
| 2 | BulkPortfolioUpload.tsx | maxSize → 10MB, update UI text |
| 3 | PortfolioUploadEnhanced.tsx | maxSize → 10MB, update UI text |
| 4 | Pricing pages | No change needed (already correct) |

