import { QUESTIONS } from './constants';

/**
 * Represents the parsed results from the live scorecard API.
 * This maps question IDs to actual values from the match.
 */
export interface ActualResults {
    // Pre-match
    tossWinner?: string;        // Q1: 'India' or 'New Zealand'
    captainChoice?: string;     // Q2: 'Bat' or 'Bowl'
    // India Batting
    indiaTotalRuns?: number;    // Q3
    indiaSixes?: number;        // Q4
    indiaFours?: number;        // Q5
    sanjuRuns?: number;         // Q6
    ishanRuns?: number;         // Q7
    skRuns?: number;            // Q8
    abhishekRuns?: number;      // Q9
    tilakRuns?: number;         // Q10
    hardikBatRuns?: number;     // Q11
    mostSixesPlayer?: string;   // Q12
    indiaPowerplayWickets?: number;  // Q13
    india50InPowerplay?: string; // Q14: 'Yes' or 'No'
    indiaCentury?: string;      // Q15: 'Yes' or 'No'
    indiaFifty?: string;        // Q16: 'Yes' or 'No'
    // India Bowling
    bumrahWickets?: number;     // Q17
    arshdeepWickets?: number;   // Q18
    axarWickets?: number;       // Q19
    varunWickets?: number;      // Q20
    hardikBowlWickets?: number; // Q21
    bumrahRuns?: number;        // Q22
    indiaTotalWides?: number;   // Q23
    // NZ
    nzTotalRuns?: number;       // Q24
    nzTotalWickets?: number;    // Q25
    nzFifty?: string;           // Q26: 'Yes' or 'No'
    // Fielding & Results
    firstCatch?: string;        // Q27
    runOut?: string;            // Q28: 'Yes' or 'No'
    playerOfMatch?: string;     // Q29
    indiaWin?: string;          // Q30: 'Yes' or 'No'
}

/**
 * Maps question IDs to their corresponding actual result keys.
 */
const QUESTION_RESULT_MAP: Record<number, keyof ActualResults> = {
    1: 'tossWinner',
    2: 'captainChoice',
    3: 'indiaTotalRuns',
    4: 'indiaSixes',
    5: 'indiaFours',
    6: 'sanjuRuns',
    7: 'ishanRuns',
    8: 'skRuns',
    9: 'abhishekRuns',
    10: 'tilakRuns',
    11: 'hardikBatRuns',
    12: 'mostSixesPlayer',
    13: 'indiaPowerplayWickets',
    14: 'india50InPowerplay',
    15: 'indiaCentury',
    16: 'indiaFifty',
    17: 'bumrahWickets',
    18: 'arshdeepWickets',
    19: 'axarWickets',
    20: 'varunWickets',
    21: 'hardikBowlWickets',
    22: 'bumrahRuns',
    23: 'indiaTotalWides',
    24: 'nzTotalRuns',
    25: 'nzTotalWickets',
    26: 'nzFifty',
    27: 'firstCatch',
    28: 'runOut',
    29: 'playerOfMatch',
    30: 'indiaWin',
};

/**
 * Compares two numerical values with a tolerance margin.
 * - Exact match: full points
 * - Within ±5 (for runs) or ±1 (for wickets/sixes/fours): half points
 */
function scoreNumeric(prediction: number, actual: number, fullPoints: number, tolerance = 5): number {
    if (prediction === actual) return fullPoints;
    if (Math.abs(prediction - actual) <= tolerance) return Math.floor(fullPoints / 2);
    return 0;
}

/**
 * Compares two string values case-insensitively.
 */
function scoreText(prediction: string, actual: string, fullPoints: number): number {
    const p = prediction.trim().toLowerCase();
    const a = actual.trim().toLowerCase();
    if (p === a || a.includes(p) || p.includes(a)) return fullPoints;
    return 0;
}

/**
 * Calculates the total points for a guest given their answers and the actual results.
 * Returns a breakdown per question and total points.
 */
export function calculateScore(
    answers: Record<number, string>,
    actualResults: ActualResults
): { points: number; breakdown: Record<number, number> } {
    let totalPoints = 0;
    const breakdown: Record<number, number> = {};

    for (const question of QUESTIONS) {
        const prediction = answers[question.id];
        const resultKey = QUESTION_RESULT_MAP[question.id];

        if (prediction === undefined || prediction === '' || !resultKey) {
            breakdown[question.id] = 0;
            continue;
        }

        const actual = actualResults[resultKey];
        if (actual === undefined || actual === null) {
            breakdown[question.id] = 0;
            continue;
        }

        let earned = 0;

        if (question.type === 'number') {
            const predNum = parseFloat(prediction);
            const actualNum = Number(actual);
            if (!isNaN(predNum) && !isNaN(actualNum)) {
                // Use tighter tolerance for small numbers (wickets, sixes, etc.)
                const tolerance = actualNum <= 10 ? 1 : 5;
                earned = scoreNumeric(predNum, actualNum, question.points, tolerance);
            }
        } else if (question.type === 'select') {
            // Exact match required for select
            earned = prediction.toLowerCase() === String(actual).toLowerCase() ? question.points : 0;
        } else {
            // Free text - partial match allowed
            earned = scoreText(prediction, String(actual), question.points);
        }

        breakdown[question.id] = earned;
        totalPoints += earned;
    }

    return { points: totalPoints, breakdown };
}

/**
 * Creates mock actual results from demo live match data
 * This is used for testing when RapidAPI doesn't return full scorecard
 */
export function getDemoResults(): ActualResults {
    return {
        tossWinner: 'India',
        captainChoice: 'Bat',
        indiaTotalRuns: 165,
        indiaSixes: 8,
        indiaFours: 14,
        sanjuRuns: 45,
        ishanRuns: 32,
        skRuns: 28,
        abhishekRuns: 15,
        tilakRuns: 22,
        hardikBatRuns: 18,
        mostSixesPlayer: 'Sanju Samson',
        indiaPowerplayWickets: 1,
        india50InPowerplay: 'Yes',
        indiaCentury: 'No',
        indiaFifty: 'Yes',
        bumrahWickets: 2,
        arshdeepWickets: 1,
        axarWickets: 1,
        varunWickets: 1,
        hardikBowlWickets: 0,
        bumrahRuns: 32,
        indiaTotalWides: 2,
        nzTotalRuns: 158,
        nzTotalWickets: 8,
        nzFifty: 'Yes',
        firstCatch: 'Varun Chakravarthy',
        runOut: 'Yes',
        playerOfMatch: 'Sanju Samson',
        indiaWin: 'Yes',
    };
}

/**
 * Parses the raw Cricbuzz scorecard JSON into our ActualResults format.
 * This function must be updated if the API response structure changes.
 */
export function parseScorecardToResults(scorecard: any): ActualResults {
    const results: ActualResults = {};

    try {
        // Debug logging
        console.log('Parsing scorecard with status:', scorecard?.matchInfo?.state);

        const matchInfo = scorecard?.matchInfo;
        const matchScore = scorecard?.matchScore;
        const team1 = matchInfo?.team1 || {};
        const team2 = matchInfo?.team2 || {};

        if (!matchInfo) {
            console.log('No matchInfo found');
            return results;
        }

        // Toss info
        const tossResults = matchInfo?.tossResults;
        if (tossResults) {
            results.tossWinner = tossResults.tossWinnerName?.includes('India') ? 'India' : 'New Zealand';
            results.captainChoice = tossResults.decision === 'bat' ? 'Bat' : 'Bowl';
        }

        // Identify Teams
        const team1IsIndia = (team1.teamName || team1.teamSName || '').toLowerCase().includes('ind');
        const team1Id = team1.teamId;
        const team2Id = team2.teamId;

        // Understand who's batting now
        const currBatTeamId = matchInfo?.currBatTeamId;
        const isBattingTeam1 = currBatTeamId === team1Id;

        // Find Innings
        let indiaInnings = null;
        let nzInnings = null;

        if (matchScore) {
            if (team1IsIndia) {
                // Team1 is India, Team2 is NZ
                const indScoreObj = matchScore.team1Score;
                const nzScoreObj = matchScore.team2Score;

                if (indScoreObj) {
                    const keys = Object.keys(indScoreObj);
                    if (keys.length > 0) indiaInnings = indScoreObj[keys[keys.length - 1]];
                }
                if (nzScoreObj) {
                    const keys = Object.keys(nzScoreObj);
                    if (keys.length > 0) nzInnings = nzScoreObj[keys[keys.length - 1]];
                }
            } else {
                // Team1 is NZ, Team2 is India
                const indScoreObj = matchScore.team2Score;
                const nzScoreObj = matchScore.team1Score;

                if (indScoreObj) {
                    const keys = Object.keys(indScoreObj);
                    if (keys.length > 0) indiaInnings = indScoreObj[keys[keys.length - 1]];
                }
                if (nzScoreObj) {
                    const keys = Object.keys(nzScoreObj);
                    if (keys.length > 0) nzInnings = nzScoreObj[keys[keys.length - 1]];
                }
            }
        }

        // India Batting stats
        if (indiaInnings) {
            console.log('Found India innings:', indiaInnings.runs, '/', indiaInnings.wickets);

            const batDetails = indiaInnings.batTeamDetails;
            results.indiaTotalRuns = indiaInnings.runs || 0;

            let sixesCount = 0;
            let foursCount = 0;
            let maxSixes = 0;
            let maxSixesPlayer = '';
            let hasCentury = false;
            let hasFifty = false;

            const batsmen = batDetails?.batsmen || [];
            batsmen.forEach((b: any) => {
                const runs = b.batRuns || 0;
                const sixes = b.batSixes || 0;
                const fours = b.batFours || 0;
                sixesCount += sixes;
                foursCount += fours;

                const name = b.batName?.toLowerCase() || '';
                if (name.includes('samson')) results.sanjuRuns = runs;
                if (name.includes('kishan')) results.ishanRuns = runs;
                if (name.includes('suryakumar') || name.includes('yadav')) results.skRuns = runs;
                if (name.includes('abhishek')) results.abhishekRuns = runs;
                if (name.includes('tilak')) results.tilakRuns = runs;
                if (name.includes('pandya') || name.includes('hardik')) results.hardikBatRuns = runs;

                if (sixes > maxSixes) { maxSixes = sixes; maxSixesPlayer = b.batName; }
                if (runs >= 100) hasCentury = true;
                if (runs >= 50) hasFifty = true;
            });

            results.indiaSixes = sixesCount;
            results.indiaFours = foursCount;
            results.mostSixesPlayer = maxSixesPlayer;
            results.indiaCentury = hasCentury ? 'Yes' : 'No';
            results.indiaFifty = hasFifty ? 'Yes' : 'No';

            // Powerplay data (if available)
            const powerplayData = indiaInnings.ppData?.pp_1;
            if (powerplayData) {
                results.indiaPowerplayWickets = powerplayData.ppWkts ?? 0;
                results.india50InPowerplay = (powerplayData.ppRuns ?? 0) > 50 ? 'Yes' : 'No';
            }
        }

        // Get Bowling stats from NZ's batting innings
        if (nzInnings) {
            console.log('Found NZ innings:', nzInnings.runs, '/', nzInnings.wickets);

            results.nzTotalRuns = nzInnings.runs || 0;
            results.nzTotalWickets = nzInnings.wickets || 0;

            let nzHasFifty = false;
            const nzBatsmen = nzInnings.batTeamDetails?.batsmen || [];
            nzBatsmen.forEach((b: any) => {
                if ((b.batRuns || 0) >= 50) nzHasFifty = true;
            });
            results.nzFifty = nzHasFifty ? 'Yes' : 'No';

            // India's bowling stats come from the bowlers list when NZ bats
            const indBowlers = nzInnings.bowlTeamDetails?.bowlers || [];
            let totalWides = 0;
            indBowlers.forEach((b: any) => {
                const name = b.bowlName?.toLowerCase() || '';
                if (name.includes('bumrah')) {
                    results.bumrahWickets = b.bowlWkts || 0;
                    results.bumrahRuns = b.bowlRuns || 0;
                }
                if (name.includes('arshdeep')) results.arshdeepWickets = b.bowlWkts || 0;
                if (name.includes('axar')) results.axarWickets = b.bowlWkts || 0;
                if (name.includes('varun') || name.includes('chakaravarthy')) results.varunWickets = b.bowlWkts || 0;
                if (name.includes('pandya') || name.includes('hardik')) results.hardikBowlWickets = b.bowlWkts || 0;
                totalWides += b.bowlWides || 0;
            });
            results.indiaTotalWides = totalWides;
        }

        // Match result
        const status = matchInfo?.status || matchInfo?.matchDesc || '';
        results.indiaWin = status.toLowerCase().includes('india') && (status.toLowerCase().includes('won') || status.toLowerCase().includes('win')) ? 'Yes' : 'No';

        console.log('Parsed results:', results);

    } catch (e) {
        console.error('Error parsing scorecard:', e);
    }

    return results;
}
