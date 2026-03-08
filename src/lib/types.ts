export type Guest =
  | 'Jayesh' | 'Pragna' | 'Navin' | 'Hemant' | 'Nimisha' 
  | 'Soham' | 'Jinesh' | 'Megha' | 'Jaina' | 'Heli' 
  | 'Dhwani' | 'Jahanvi' | 'Bhrahmi' | 'Aarya' | 'Shital' 
  | 'Ami' | 'Arhat' | 'Rushabh';

export type QuestionCategory = 'PRE-MATCH' | 'INDIAN BATTING phase' | 'INDIAN BOWLING phase' | 'NEW ZEALAND (Common)' | 'MATCH FIELDING & RESULTS';

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
  matchId: string;
  status: string; // e.g. "Live", "Completed"
  teams: {
    batting: { name: string; score: number; wickets: number; overs: number };
    bowling: { name: string; score: number; wickets: number; overs: number };
  };
  liveText: string;
}
