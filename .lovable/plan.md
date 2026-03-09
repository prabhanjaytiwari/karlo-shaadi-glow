

## Changes

### 1. RateAppPrompt — Show after 2 minutes instead of 4 sessions
- Remove session-counting logic
- Simply set a 2-minute (120,000ms) timeout on mount
- Still respect `RATED_KEY` to not show again after rated

### 2. Footer — Add new page links
Add a new "Explore" column with:
- Earn With Us → `/earn`
- Sponsor Your Shaadi → `/sponsor-shaadi`
- Coming Soon → `/coming-soon`
- Shaadi Seva → `/shaadi-seva`
- Refer & Earn → `/referrals`

### Files
| File | Change |
|------|--------|
| `src/components/RateAppPrompt.tsx` | Replace session logic with 2-min timeout |
| `src/components/Footer.tsx` | Add "Explore" column with new page links |

