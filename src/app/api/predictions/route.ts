import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { Guest } from '@/lib/types';

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// POST - save predictions
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { guestName, answers } = body as { guestName: Guest; answers: Record<number, string> };

        if (!guestName || !answers) {
            return NextResponse.json({ error: 'Missing guestName or answers' }, { status: 400 });
        }

        await redis.hset('predictions', {
            [guestName]: JSON.stringify({ answers, submittedAt: new Date().toISOString() }),
        });

        return NextResponse.json({ success: true, message: 'Predictions saved!', totalPoints: null });
    } catch (err) {
        console.error('Error saving predictions:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// GET - fetch predictions
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name');

    const all = await redis.hgetall('predictions') as Record<string, string> | null;
    const parsed: Record<string, any> = {};
    for (const [key, val] of Object.entries(all || {})) {
        try { parsed[key] = typeof val === 'string' ? JSON.parse(val) : val; } catch { parsed[key] = val; }
    }

    if (name) {
        return NextResponse.json({ predictions: parsed[name] || null });
    }
    return NextResponse.json({ allPredictions: parsed });
}
