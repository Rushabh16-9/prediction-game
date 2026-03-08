import { Guest, Question } from './types';

export const GUESTS: Guest[] = [
    'Jayesh', 'Pragna', 'Navin', 'Hemant', 'Nimisha', 'Soham',
    'Jinesh', 'Megha', 'Jaina', 'Heli', 'Dhwani', 'Jahanvi',
    'Bhrahmi', 'Aarya', 'Shital', 'Ami', 'Arhat', 'Rushabh'
];

export const QUESTIONS: Question[] = [
    // PRE-MATCH QUESTIONS
    { id: 1, text: 'Who will win the Toss?', category: 'PRE-MATCH', type: 'select', options: ['India', 'New Zealand'], points: 10 },
    { id: 2, text: 'What will the Captain choose?', category: 'PRE-MATCH', type: 'select', options: ['Bat', 'Bowl'], points: 10 },

    // INDIAN BATTING PHASE
    { id: 3, text: 'Total runs India will score?', category: 'INDIAN BATTING phase', type: 'number', points: 15 },
    { id: 4, text: 'Total Sixes India will hit?', category: 'INDIAN BATTING phase', type: 'number', points: 10 },
    { id: 5, text: 'Total Fours (4s) hit by India?', category: 'INDIAN BATTING phase', type: 'number', points: 10 },
    { id: 6, text: 'Sanju Samson – How many runs?', category: 'INDIAN BATTING phase', type: 'number', points: 10 },
    { id: 7, text: 'Ishan Kishan – How many runs?', category: 'INDIAN BATTING phase', type: 'number', points: 10 },
    { id: 8, text: 'Suryakumar Yadav – How many runs?', category: 'INDIAN BATTING phase', type: 'number', points: 10 },
    { id: 9, text: 'Abhishek Sharma – How many runs?', category: 'INDIAN BATTING phase', type: 'number', points: 10 },
    { id: 10, text: 'Tilak Varma – How many runs?', category: 'INDIAN BATTING phase', type: 'number', points: 10 },
    { id: 11, text: 'Hardik Pandya – How many runs?', category: 'INDIAN BATTING phase', type: 'number', points: 10 },
    { id: 12, text: 'Which Indian player will hit the most sixes?', category: 'INDIAN BATTING phase', type: 'text', points: 15 },
    { id: 13, text: 'India wickets lost in Powerplay (1st 6 overs)?', category: 'INDIAN BATTING phase', type: 'number', points: 10 },
    { id: 14, text: 'Will India score > 50 runs in first 6 overs?', category: 'INDIAN BATTING phase', type: 'select', options: ['Yes', 'No'], points: 10 },
    { id: 15, text: 'Will any Indian batsman score a century?', category: 'INDIAN BATTING phase', type: 'select', options: ['Yes', 'No'], points: 10 },
    { id: 16, text: 'Will any Indian batsman score a fifty?', category: 'INDIAN BATTING phase', type: 'select', options: ['Yes', 'No'], points: 10 },

    // INDIAN BOWLING PHASE
    { id: 17, text: 'Jasprit Bumrah – How many wickets?', category: 'INDIAN BOWLING phase', type: 'number', points: 10 },
    { id: 18, text: 'Arshdeep Singh – How many wickets?', category: 'INDIAN BOWLING phase', type: 'number', points: 10 },
    { id: 19, text: 'Axar Patel – How many wickets?', category: 'INDIAN BOWLING phase', type: 'number', points: 10 },
    { id: 20, text: 'Varun Chakaravarthy – How many wickets?', category: 'INDIAN BOWLING phase', type: 'number', points: 10 },
    { id: 21, text: 'Hardik Pandya – How many wickets?', category: 'INDIAN BOWLING phase', type: 'number', points: 10 },
    { id: 22, text: 'How many runs will Bumrah give in 4 overs?', category: 'INDIAN BOWLING phase', type: 'number', points: 10 },
    { id: 23, text: 'Total wide balls bowled by India?', category: 'INDIAN BOWLING phase', type: 'number', points: 10 },

    // NEW ZEALAND
    { id: 24, text: 'Total runs New Zealand will score?', category: 'NEW ZEALAND (Common)', type: 'number', points: 15 },
    { id: 25, text: 'Total wickets New Zealand will lose?', category: 'NEW ZEALAND (Common)', type: 'number', points: 10 },
    { id: 26, text: 'Will any NZ batsman score a fifty?', category: 'NEW ZEALAND (Common)', type: 'select', options: ['Yes', 'No'], points: 10 },

    // MATCH FIELDING & RESULTS
    { id: 27, text: 'Who will take the first catch for India?', category: 'MATCH FIELDING & RESULTS', type: 'text', points: 15 },
    { id: 28, text: 'Will there be a Run Out in the match?', category: 'MATCH FIELDING & RESULTS', type: 'select', options: ['Yes', 'No'], points: 10 },
    { id: 29, text: 'Who will be the Player of the Match?', category: 'MATCH FIELDING & RESULTS', type: 'text', points: 15 },
    { id: 30, text: 'FINAL WINNER: Will India win the Match?', category: 'MATCH FIELDING & RESULTS', type: 'select', options: ['Yes', 'No'], points: 20 },

    // JACKPOT 🎰 — High-risk, high-reward (25–50 pts)
    { id: 31, text: '🎰 JACKPOT: India\'s total score range?', category: 'JACKPOT 🎰', type: 'select', options: ['Under 140', '140–159', '160–179', '180–199', '200–219', '220+'], points: 30 },
    { id: 32, text: '🎰 JACKPOT: Who will take India\'s FIRST wicket?', category: 'JACKPOT 🎰', type: 'text', points: 35 },
    { id: 33, text: '🎰 JACKPOT: Will Bumrah bowl a maiden over?', category: 'JACKPOT 🎰', type: 'select', options: ['Yes', 'No'], points: 25 },
    { id: 34, text: '🎰 JACKPOT: Total no-balls in the entire match?', category: 'JACKPOT 🎰', type: 'number', points: 30 },
    { id: 35, text: '🎰 JACKPOT: Who will be NZ\'s top scorer?', category: 'JACKPOT 🎰', type: 'text', points: 35 },
    { id: 36, text: '🎰 JACKPOT: Will India lose their last 5 wickets for under 30 runs?', category: 'JACKPOT 🎰', type: 'select', options: ['Yes', 'No'], points: 40 },
    { id: 37, text: '🎰 JACKPOT: Exact over in which India\'s 5th wicket falls? (e.g. 14)', category: 'JACKPOT 🎰', type: 'number', points: 50 },
    { id: 38, text: '🎰 JACKPOT: Will any bowler take a hat-trick in this match?', category: 'JACKPOT 🎰', type: 'select', options: ['Yes', 'No'], points: 50 },
];
