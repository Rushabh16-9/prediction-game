import { NextRequest, NextResponse } from 'next/server';

// Use a global variable to persist active sessions in development and across API hot-reloads
const globalForSessions = globalThis as unknown as {
    activeSessions: Record<string, string>;
};

if (!globalForSessions.activeSessions) {
    globalForSessions.activeSessions = {};
}

// GET - return list of currently taken names
export async function GET() {
    return NextResponse.json({ takenNames: Object.keys(globalForSessions.activeSessions) });
}

// POST - claim a name (login)
export async function POST(req: NextRequest) {
    try {
        const { name } = await req.json();
        if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 });

        if (globalForSessions.activeSessions[name]) {
            // Name already taken by someone else
            return NextResponse.json({ error: 'Name already taken', taken: true }, { status: 409 });
        }

        globalForSessions.activeSessions[name] = new Date().toISOString();
        return NextResponse.json({ success: true });
    } catch (e) {
        console.error('Active Sessions POST Error:', e);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

// DELETE - release a name (logout)
export async function DELETE(req: NextRequest) {
    try {
        const { name } = await req.json();
        if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 });

        delete globalForSessions.activeSessions[name];
        return NextResponse.json({ success: true });
    } catch (e) {
        console.error('Active Sessions DELETE Error:', e);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

