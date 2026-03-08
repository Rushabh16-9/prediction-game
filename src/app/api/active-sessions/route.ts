import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

// GET - return list of currently taken names
export async function GET() {
    const sessions = await kv.hgetall('active_sessions') as Record<string, string> | null;
    return NextResponse.json({ takenNames: Object.keys(sessions || {}) });
}

// POST - claim a name (login)
export async function POST(req: NextRequest) {
    try {
        const { name } = await req.json();
        if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 });

        // Atomic check-and-set: only set if field doesn't exist
        const existing = await kv.hget('active_sessions', name);
        if (existing) {
            return NextResponse.json({ error: 'Name already taken', taken: true }, { status: 409 });
        }

        await kv.hset('active_sessions', { [name]: new Date().toISOString() });
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

        await kv.hdel('active_sessions', name);
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
