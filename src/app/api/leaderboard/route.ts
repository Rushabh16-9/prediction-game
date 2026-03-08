import { NextResponse } from 'next/server';
import { GUESTS } from '@/lib/constants';
import { calculateScore, parseScorecardToResults } from '@/lib/scoring';

// Access the global variable defined in predictions/route.ts
const globalForPredictions = globalThis as unknown as {
    matchPredictions?: Record<string, { answers: Record<number, string>; submittedAt: string }>;
};

function readPredictions() {
    return globalForPredictions.matchPredictions || {};
}

async function fetchScorecard() {
    const matchId = process.env.MATCH_ID;
    const apiKey = process.env.NEXT_PUBLIC_CRICKET_API_KEY || process.env.RAPIDAPI_KEY;

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
        const predictions = readPredictions();

        // Try to get live scorecard for real points calculation
        const scorecard = await fetchScorecard();
        const actualResults = scorecard ? parseScorecardToResults(scorecard) : null;

        const leaderboard = GUESTS.map((guest) => {
            const guestPredictions = predictions[guest];
            if (!guestPredictions) {
                return { name: guest, totalPoints: 0, answeredCount: 0 };
            }

            const answeredCount = Object.keys(guestPredictions.answers || {}).length;

            if (actualResults) {
                const { points } = calculateScore(guestPredictions.answers, actualResults);
                return { name: guest, totalPoints: points, answeredCount };
            }

            return { name: guest, totalPoints: 0, answeredCount };
        });

        // Sort by points descending
        leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);

        return NextResponse.json({ leaderboard });
    } catch (err) {
        console.error('Leaderboard error:', err);
        return NextResponse.json({ leaderboard: [] }, { status: 500 });
    }
}
