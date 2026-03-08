import { NextRequest, NextResponse } from 'next/server';
import { getRedisClient } from '@/lib/redis';

// GET - return list of currently taken names
export async function GET() {
    try {
        const redis = getRedisClient();
        const sessions = await redis.hgetall('active_sessions') as Record<string, string> | null;
        return NextResponse.json({ takenNames: Object.keys(sessions || {}) });
    } catch (err: any) {
        return NextResponse.json({ takenNames: [], error: err.message }, { status: 500 });
    }
}

// POST - claim a name (login)
export async function POST(req: NextRequest) {
    try {
        const redis = getRedisClient();
        const { name } = await req.json();
        if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 });

        const existing = await redis.hget('active_sessions', name);
        if (existing) {
            return NextResponse.json({ error: 'Name already taken', taken: true }, { status: 409 });
        }

        await redis.hset('active_sessions', { [name]: new Date().toISOString() });
        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
    }
}

// DELETE - release a name (logout)
export async function DELETE(req: NextRequest) {
    try {
        const redis = getRedisClient();
        const { name } = await req.json();
        if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 });

        await redis.hdel('active_sessions', name);
        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
    }
}
