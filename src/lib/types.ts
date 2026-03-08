export type Guest =
  | 'Jayesh' | 'Pragna' | 'Navin' | 'Hemant' | 'Nimisha'
  | 'Soham' | 'Jinesh' | 'Megha' | 'Jaina' | 'Heli'
  | 'Dhwani' | 'Jahanvi' | 'Bhrahmi' | 'Aarya' | 'Shital'
  | 'Ami' | 'Arhat' | 'Rushabh';

export type QuestionCategory = 'PRE-MATCH' | 'INDIAN BATTING phase' | 'INDIAN BOWLING phase' | 'NEW ZEALAND (Common)' | 'MATCH FIELDING & RESULTS' | 'JACKPOT 🎰';

export interface Question {
  id: number;
  text: string;
  category: QuestionCategory;
  type: 'select' | 'number' | 'text';
  options?: string[]; // Used if type is 'select'
  points: number;
}

export interface Prediction {
  guestName: Guest;
  answers: Record<number, string | number>;
  totalPoints?: number;
}

export interface MatchScore {
  matchId?: string;
  status: string; // e.g. "Live", "Completed", "Preview"
  matchDesc?: string;
  series?: string;
  venue?: string;
  teams: {
    batting: { name: string; fullName?: string; score: number; wickets: number; overs: number };
    bowling: { name: string; fullName?: string; score: number; wickets: number; overs: number };
  };
  liveText: string;
  tossInfo?: {
    winner: string | null;
    choice: string | null;
    indiaBattingFirst: boolean;
  };
  scorecard?: {
    currentBatsmen: Array<{
      name: string;
      runs: number;
      balls: number;
      fours: number;
      sixes: number;
      strikeRate: number;
      isStriker: boolean;
    }>;
    currentBowler?: {
      name: string;
      overs: number;
      maidens: number;
      runs: number;
      wickets: number;
      economy: number;
    };
    partnership?: {
      runs: number;
      balls: number;
      batsmen: string[];
    };
    recentOvers: string[];
  };
}
