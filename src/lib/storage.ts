import fs from 'fs';
import path from 'path';

const PREDICTIONS_FILE = path.join(process.cwd(), 'data', 'predictions.json');

export interface StoredPredictions {
  [guestName: string]: {
    answers: Record<number, string>;
    submittedAt: string;
  };
}

// Initialize data directory if it doesn't exist
function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Load predictions from file
export function loadPredictions(): StoredPredictions {
  try {
    ensureDataDir();
    if (fs.existsSync(PREDICTIONS_FILE)) {
      const data = fs.readFileSync(PREDICTIONS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.warn('Error loading predictions from file:', err);
  }
  return {};
}

// Save predictions to file
export function savePredictions(predictions: StoredPredictions): void {
  try {
    ensureDataDir();
    fs.writeFileSync(PREDICTIONS_FILE, JSON.stringify(predictions, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving predictions to file:', err);
  }
}

// Get a single guest's predictions
export function getGuestPredictions(guestName: string): StoredPredictions[string] | null {
  const allPredictions = loadPredictions();
  return allPredictions[guestName] || null;
}

// Save a single guest's predictions
export function saveGuestPredictions(guestName: string, answers: Record<number, string>): void {
  const allPredictions = loadPredictions();
  allPredictions[guestName] = {
    answers,
    submittedAt: new Date().toISOString(),
  };
  savePredictions(allPredictions);
}

// Get all predictions
export function getAllPredictions(): StoredPredictions {
  return loadPredictions();
}
