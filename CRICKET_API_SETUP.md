# Cricket Match Live Score - Setup Guide

## Quick Start 🚀

Your webapp is now configured to use **CricketData.org API** for live cricket matches. This is a free, reliable service perfect for live score updates.

### Step 1: Get Your Free API Key

1. Visit: https://cricketdata.org/signup.aspx
2. Sign up (instant, no credit card required)
3. Copy your API key from the dashboard
4. Add it to `.env.local`:

```env
NEXT_PUBLIC_CRICKET_API_KEY=your-api-key-here
MATCH_ID=5046227
```

### Step 2: Find a Match ID

Get live match IDs from: https://cricketdata.org/live-scores

Example match IDs:
- **5046227** - Current ongoing match
- View the CricketData website to find matches by:
  - Team names
  - Series name
  - Match type (ODI, T20, Test, etc.)

### Step 3: Update Match ID

Once you have a match ID, update `.env.local`:

```env
NEXT_PUBLIC_CRICKET_API_KEY=your-api-key-here
MATCH_ID=5046227
```

The webapp will automatically start displaying:
- ✅ Live match score
- ✅ Current batting team
- ✅ Wickets and overs
- ✅ Match venue and series
- ✅ Real-time updates every 10 seconds

## CricketData API Endpoints

### Get Current Live Matches
```bash
GET https://api.cricapi.com/v1/currentMatches?apikey=YOUR_KEY&offset=0
```

### Get Specific Match Details
```bash
GET https://api.cricapi.com/v1/match_info?apikey=YOUR_KEY&id=MATCH_ID
```

Response includes:
- Match status and state
- Team names
- Current score (runs, wickets, overs)
- Venue information
- Series details

## Rate Limits

- **Free tier**: 500 requests/day
- **Polling interval**: 10 seconds (our current setting)
- **Calculations**: 144 requests/day ≈ 10 days of continuous polling

### Cost Analysis
- 10-hour match event = 3,600 requests
- Free tier covers ~1 week of event-based polling
- Perfect for weekend cricket matches!

## Troubleshooting

**"Get a FREE API key" message in the webapp?**
- Check that `NEXT_PUBLIC_CRICKET_API_KEY` is set in `.env.local`
- Restart the dev server: `npm run dev`

**"Match not found or invalid match ID"?**
- Visit https://cricketdata.org/live-scores
- Copy the exact Match ID from the URL or list
- Update `.env.local` and restart

**No updates appearing?**
- Open browser DevTools → Console
- Check for any error messages
- Verify API key has no spaces
- Check internet connection

## File Structure

```
src/app/api/live-score/route.ts    ← Fetches from CricAPI
src/components/MatchBar.tsx         ← Displays live score
src/lib/types.ts                    ← Score data types
.env.local                          ← Your API key
```

## Next Steps

1. ✅ Get API key from cricketdata.org
2. ✅ Find a live match and add its ID
3. ✅ Restart the dev server
4. ✅ Visit http://localhost:3000 to see live updates
5. ✅ Deploy to production with environment variables

---

**Need help?** The CricketData API has excellent documentation at https://rapidapi.com/dev.harsh/api/crickbuzz
