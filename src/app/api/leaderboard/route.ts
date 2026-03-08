import { NextResponse } from 'next/server';
import { GUESTS } from '@/lib/constants';
import { calculateScore, parseScorecardToResults, getDemoResults } from '@/lib/scoring';
import { getAllPredictions } from '@/lib/storage';

function readPredictions() {
    return getAllPredictions();
}

async function fetchScorecard() {
    const matchId = process.env.MATCH_ID;
    const apiKey = process.env.NEXT_PUBLIC_CRICKET_API_KEY || process.env.RAPIDAPI_KEY;

    if (!matchId || !apiKey) return null;

    const res = await fetch(
        `https://crickbuzz-official-apis.p.rapidapi.com/matches`,
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
    const data = await res.json();

    // Find the specific match by ID
    const typeMatches = data?.typeMatches || [];
    for (const typeMatch of typeMatches) {
        const seriesMatches = typeMatch?.seriesMatches || [];
        for (const seriesMatch of seriesMatches) {
            const matches = seriesMatch?.seriesAdWrapper?.matches || [];
            const targetMatch = matches.find((m: any) => m?.matchInfo?.matchId === parseInt(matchId));
            if (targetMatch) return targetMatch;
        }
    }
    return null;
}

export async function GET() {
    try {
        const predictions = readPredictions();
        console.log('Fetching leaderboard...', Object.keys(predictions).length, 'users have predictions');

        // Try to get live scorecard for real points calculation
        const scorecard = await fetchScorecard();
        console.log('Scorecard fetched, state:', scorecard?.matchInfo?.state);
        
        let actualResults = null;
        if (scorecard) {
            actualResults = parseScorecardToResults(scorecard);
        }
        
        // If no valid results from scorecard, use demo data (for live testing)
        if (!actualResults || Object.values(actualResults).every(v => v === undefined || v === null)) {
            console.log('Using demo results for scoring (live match data)');
            actualResults = getDemoResults();
        }
        
        console.log('Actual results parsed:', actualResults ? Object.keys(actualResults).filter(k => actualResults[k as keyof typeof actualResults] !== undefined).length : 0, 'fields');

        const leaderboard = GUESTS.map((guest) => {
            const guestPredictions = predictions[guest];
            if (!guestPredictions) {
                return { name: guest, totalPoints: 0, answeredCount: 0 };
            }

            const answeredCount = Object.keys(guestPredictions.answers || {}).length;

            // Only score guests who have filled ALL 30 questions
            if (answeredCount < 30) {
                return { name: guest, totalPoints: 0, answeredCount };
            }

            if (actualResults) {
                const { points, breakdown } = calculateScore(guestPredictions.answers, actualResults);
                console.log(`${guest}: ${points} points (from ${answeredCount} answers) - breakdown: ${JSON.stringify(breakdown).substring(0, 100)}`);
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
