import { NextRequest, NextResponse } from 'next/server';
import { Guest } from '@/lib/types';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'predictions.json');

// Ensure data directory and file exist
function ensureDataFile() {
    const dir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify({}), 'utf-8');
    }
}

function readData(): Record<string, { answers: Record<number, string>; submittedAt: string }> {
    ensureDataFile();
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(content);
}

function writeData(data: Record<string, any>) {
    ensureDataFile();
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { guestName, answers } = body as { guestName: Guest; answers: Record<number, string> };

        if (!guestName || !answers) {
            return NextResponse.json({ error: 'Missing guestName or answers' }, { status: 400 });
        }

        const data = readData();
        data[guestName] = {
            answers,
            submittedAt: new Date().toISOString(),
        };
        writeData(data);

        return NextResponse.json({ success: true, message: 'Predictions saved!', totalPoints: null });
    } catch (err) {
        console.error('Error saving predictions:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name');
    const data = readData();
    if (name) {
        return NextResponse.json({ predictions: data[name] || null });
    }
    return NextResponse.json({ allPredictions: data });
}
