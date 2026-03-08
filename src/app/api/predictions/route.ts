import { NextRequest, NextResponse } from 'next/server';
import { Guest } from '@/lib/types';

// Use a global variable to persist predictions in development and across API hot-reloads
const globalForPredictions = globalThis as unknown as {
    matchPredictions: Record<string, { answers: Record<number, string>; submittedAt: string }>;
};

if (!globalForPredictions.matchPredictions) {
    globalForPredictions.matchPredictions = {};
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { guestName, answers } = body as { guestName: Guest; answers: Record<number, string> };

        if (!guestName || !answers) {
            return NextResponse.json({ error: 'Missing guestName or answers' }, { status: 400 });
        }

        globalForPredictions.matchPredictions[guestName] = {
            answers,
            submittedAt: new Date().toISOString(),
        };

        return NextResponse.json({ success: true, message: 'Predictions saved!', totalPoints: null });
    } catch (err) {
        console.error('Error saving predictions:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name');
    const data = globalForPredictions.matchPredictions;
    if (name) {
        return NextResponse.json({ predictions: data[name] || null });
    }
    return NextResponse.json({ allPredictions: data });
}
