import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const SESSIONS_FILE = path.join(process.cwd(), 'data', 'sessions.json');

function ensureFile() {
    const dir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(SESSIONS_FILE)) fs.writeFileSync(SESSIONS_FILE, JSON.stringify({}), 'utf-8');
}

function readSessions(): Record<string, string> {
    ensureFile();
    return JSON.parse(fs.readFileSync(SESSIONS_FILE, 'utf-8'));
}

function writeSessions(data: Record<string, string>) {
    ensureFile();
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// GET - return list of currently taken names
export async function GET() {
    const sessions = readSessions();
    return NextResponse.json({ takenNames: Object.keys(sessions) });
}

// POST - claim a name (login)
export async function POST(req: NextRequest) {
    try {
        const { name } = await req.json();
        if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 });

        const sessions = readSessions();

        if (sessions[name]) {
            // Name already taken by someone else
            return NextResponse.json({ error: 'Name already taken', taken: true }, { status: 409 });
        }

        sessions[name] = new Date().toISOString();
        writeSessions(sessions);
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

        const sessions = readSessions();
        delete sessions[name];
        writeSessions(sessions);
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
