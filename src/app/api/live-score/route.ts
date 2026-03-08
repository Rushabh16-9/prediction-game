import { NextResponse } from 'next/server';

export async function GET() {
    const matchId = process.env.MATCH_ID;
    const apiKey = process.env.RAPIDAPI_KEY;

    // Return placeholder/demo data if API not configured
    if (!matchId || !apiKey) {
        return NextResponse.json({
            status: 'Demo Mode',
            liveText: 'Configure MATCH_ID and RAPIDAPI_KEY to see live data',
            teams: {
                batting: { name: 'IND', score: 0, wickets: 0, overs: 0 },
                bowling: { name: 'NZ', score: 0, wickets: 0, overs: 0 },
            },
        });
    }

    try {
        const res = await fetch(
            `https://crickbuzz-official-apis.p.rapidapi.com/matches/v1/recent`,
            {
                method: 'GET',
                headers: {
                    'x-rapidapi-host': 'crickbuzz-official-apis.p.rapidapi.com',
                    'x-rapidapi-key': apiKey,
                },
                cache: 'no-store',
            }
        );

        if (!res.ok) {
            const errText = await res.text();
            console.error(`Crickbuzz API error ${res.status}:`, errText);
            
            // Return fallback preview data if API fails
            return NextResponse.json({
                status: 'Preview',
                liveText: '🏆 T20 World Cup Final - IND vs NZ - Match starts at Mar 08, 13:30 GMT',
                teams: {
                    batting: { name: 'IND', score: 0, wickets: 0, overs: 0 },
                    bowling: { name: 'NZ', score: 0, wickets: 0, overs: 0 },
                },
            });
        }

        const data = await res.json();

        // Parse Crickbuzz API response to find the IND vs NZ T20 World Cup Final match
        const typeMatches = data?.typeMatches || [];
        
        // Find the International T20 World Cup Final match
        let targetMatch = null;
        
        for (const typeMatch of typeMatches) {
            if (typeMatch.matchType === 'International') {
                for (const seriesMatch of typeMatch.seriesMatches || []) {
                    for (const match of seriesMatch.seriesAdWrapper?.matches || []) {
                        if (match.matchInfo?.matchId === parseInt(matchId)) {
                            targetMatch = match;
                            break;
                        }
                    }
                    if (targetMatch) break;
                }
            }
            if (targetMatch) break;
        }

        if (targetMatch && targetMatch.matchInfo) {
            const matchInfo = targetMatch.matchInfo;
            const matchScore = targetMatch.matchScore;

            // Check match state
            const state = matchInfo.state || matchInfo.stateTitle || 'Preview';
            const status = matchInfo.status || '';

            if (state === 'Preview' || state === 'Toss') {
                // Match not started
                return NextResponse.json({
                    status: 'Preview',
                    liveText: `🏆 ${matchInfo.matchDesc} - ${status || 'Match not started'}`,
                    teams: {
                        batting: { name: matchInfo.team1.teamSName, score: 0, wickets: 0, overs: 0 },
                        bowling: { name: matchInfo.team2.teamSName, score: 0, wickets: 0, overs: 0 },
                    },
                });
            }

            // Match is live or completed
            const currBatTeamId = matchInfo.currBatTeamId;
            const team1 = matchInfo.team1;
            const team2 = matchInfo.team2;

            const battingTeam = currBatTeamId === team1.teamId ? team1.teamSName : team2.teamSName;
            const bowlingTeam = currBatTeamId === team1.teamId ? team2.teamSName : team1.teamSName;

            // Get batting team's latest innings score
            const battingTeamScore = currBatTeamId === team1.teamId ? matchScore?.team1Score : matchScore?.team2Score;
            const inningsKeys = Object.keys(battingTeamScore || {});
            const latestInningsKey = inningsKeys[inningsKeys.length - 1];
            const currentInnings = battingTeamScore?.[latestInningsKey];

            const score = currentInnings?.runs ?? 0;
            const wickets = currentInnings?.wickets ?? 0;
            const overs = currentInnings?.overs ?? 0;

            return NextResponse.json({
                status: state,
                liveText: status || `${battingTeam} ${score}/${wickets} (${overs})`,
                teams: {
                    batting: { name: battingTeam, score, wickets, overs },
                    bowling: { name: bowlingTeam, score: 0, wickets: 0, overs: 0 },
                },
            });
        }

        // Fallback: Show IND vs NZ preview if match not found
        return NextResponse.json({
            status: 'Preview',
            liveText: '🏆 T20 World Cup Final - IND vs NZ - Match starts at Mar 08, 13:30 GMT',
            teams: {
                batting: { name: 'IND', score: 0, wickets: 0, overs: 0 },
                bowling: { name: 'NZ', score: 0, wickets: 0, overs: 0 },
            },
        });
    } catch (err) {
        console.error('Live score fetch error:', err);
        return NextResponse.json(
            {
                status: 'Error',
                liveText: 'Could not fetch live score',
                teams: {
                    batting: { name: 'IND', score: 0, wickets: 0, overs: 0 },
                    bowling: { name: 'NZ', score: 0, wickets: 0, overs: 0 },
                },
            },
            { status: 500 }
        );
    }
}
