import { NextRequest, NextResponse } from 'next/server';
import { Guest } from '@/lib/types';
import { getAllPredictions, saveGuestPredictions, getGuestPredictions } from '@/lib/storage';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { guestName, answers } = body as { guestName: Guest; answers: Record<number, string> };

        if (!guestName || !answers) {
            return NextResponse.json({ error: 'Missing guestName or answers' }, { status: 400 });
        }

        saveGuestPredictions(guestName, answers);

        return NextResponse.json({ success: true, message: 'Predictions saved!', totalPoints: null });
    } catch (err) {
        console.error('Error saving predictions:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name');
    
    if (name) {
        const predictions = getGuestPredictions(name);
        return NextResponse.json({ predictions: predictions || null });
    }
    
    const allData = getAllPredictions();
    return NextResponse.json({ allPredictions: allData });
}
