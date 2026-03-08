import { NextResponse } from 'next/server';
import { GUESTS } from '@/lib/constants';
import { calculateScore, parseScorecardToResults } from '@/lib/scoring';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'predictions.json');

function readPredictions() {
    if (!fs.existsSync(DATA_FILE)) return {};
    try {
        const content = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(content);
    } catch (err) {
        console.error('Error reading predictions for leaderboard:', err);
        return {};
    }
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
