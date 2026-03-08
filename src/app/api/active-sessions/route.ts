import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// GET - return list of currently taken names
export async function GET() {
    const sessions = await redis.hgetall('active_sessions') as Record<string, string> | null;
    return NextResponse.json({ takenNames: Object.keys(sessions || {}) });
}

// POST - claim a name (login)
export async function POST(req: NextRequest) {
    try {
        const { name } = await req.json();
        if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 });

        const existing = await redis.hget('active_sessions', name);
        if (existing) {
            return NextResponse.json({ error: 'Name already taken', taken: true }, { status: 409 });
        }

        await redis.hset('active_sessions', { [name]: new Date().toISOString() });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

// DELETE - release a name (logout)
export async function DELETE(req: NextRequest) {
    try {
        const { name } = await req.json();
        if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 });

        await redis.hdel('active_sessions', name);
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
