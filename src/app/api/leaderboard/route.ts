import { NextResponse } from 'next/server';
import { getRedisClient } from '@/lib/redis';
import { GUESTS } from '@/lib/constants';
import { calculateScore, parseScorecardToResults } from '@/lib/scoring';

async function readPredictions() {
    const redis = getRedisClient();
    const all = await redis.hgetall('predictions') as Record<string, string> | null;
    const parsed: Record<string, any> = {};
    for (const [key, val] of Object.entries(all || {})) {
        try { parsed[key] = typeof val === 'string' ? JSON.parse(val) : val; } catch { parsed[key] = val; }
    }
    return parsed;
}

async function fetchScorecard() {
    const matchId = process.env.MATCH_ID;
    const apiKey = process.env.RAPIDAPI_KEY;
    if (!matchId || !apiKey) return null;

    const res = await fetch(
        `https://crickbuzz-official-apis.p.rapidapi.com/matches/get-scorecard?matchId=${matchId}`,
        {
            method: 'GET',
            headers: {
                'x-rapidapi-host': 'crickbuzz-official-apis.p.rapidapi.com',
                'x-rapidapi-key': apiKey,
            },
            cache: 'no-store',
        }
    );
    if (!res.ok) return null;
    return res.json();
}

export async function GET() {
    try {
        const predictions = await readPredictions();
        const scorecard = await fetchScorecard();
        const actualResults = scorecard ? parseScorecardToResults(scorecard) : null;

        const leaderboard = GUESTS.map((guest) => {
            const guestPredictions = predictions[guest];
            if (!guestPredictions) return { name: guest, totalPoints: 0, answeredCount: 0 };

            const answeredCount = Object.keys(guestPredictions.answers || {}).length;
            if (actualResults) {
                const { points } = calculateScore(guestPredictions.answers, actualResults);
                return { name: guest, totalPoints: points, answeredCount };
            }
            return { name: guest, totalPoints: 0, answeredCount };
        });

        leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);
        return NextResponse.json({ leaderboard });
    } catch (err: any) {
        console.error('Leaderboard error:', err);
        return NextResponse.json({ leaderboard: [], error: err.message }, { status: 500 });
    }
}
