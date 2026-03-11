

# Fix Referrals System

## Problem Identified

The `profiles.referred_by` column is typed as `uuid`, but referral codes are **text strings** (e.g., "A1B2C3D4"). When Auth.tsx tries to store a referral code in this column, the insert/update silently fails because a text string cannot be cast to uuid.

Additionally, the `handle_new_user` trigger creates the profile but does **not** copy `referred_by` from user metadata. The Auth.tsx code then tries a separate `.update({ referred_by: referralCode })` call — which also fails due to the type mismatch.

This means:
- Referral codes are never saved to profiles
- The `process_referral_signup` trigger never fires
- No referral records are created
- No credits are awarded

## Fix Plan

### 1. Database Migration
- **Alter** `profiles.referred_by` from `uuid` to `text` so it can store referral code strings
- **Update** the `handle_new_user()` function to copy `referred_by` from `raw_user_meta_data` into the profile on creation, so the `process_referral_signup` trigger fires automatically

### 2. Code Cleanup (Auth.tsx)
- Remove the redundant manual `.update({ referred_by: referralCode })` call since the trigger will handle it
- The signup already passes `referred_by` in user metadata — the updated trigger will use it

### 3. No other changes needed
- `ReferralDashboard.tsx` and `ReferralWidget.tsx` query logic is correct
- `process_referral_signup` trigger logic is correct (it matches `referred_by` against `referral_code` in profiles)
- Milestones and reward triggers are properly chained

