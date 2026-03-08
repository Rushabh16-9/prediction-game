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
            `https://api.cricapi.com/v1/match_scorecard?apikey=${apiKey}&id=${matchId}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                cache: 'no-store',
            }
        );

        if (!res.ok) {
            const errText = await res.text();
            console.error(`Cricbuzz API error ${res.status}:`, errText);

            if (res.status === 404) {
                return NextResponse.json({
                    status: 'Upcoming',
                    liveText: '🏏 IND vs NZ — Match not started yet. Stay tuned!',
                    teams: {
                        batting: { name: 'IND', score: 0, wickets: 0, overs: 0 },
                        bowling: { name: 'NZ', score: 0, wickets: 0, overs: 0 },
                    },
                });
            }

            throw new Error(`API responded with ${res.status}`);
        }

        const data = await res.json();

        // For production, return the actual match data from the API
        // If API fails, return preview data as per the user's JSON

        // Check if we have valid data
        if (data && data.status !== 'failure') {
            // Parse the real API response
            const matchInfo = data?.data?.matchInfo || data?.matchInfo;
            const matchScore = data?.data?.matchScore || data?.matchScore;

            if (matchInfo) {
                // Determine current batting team
                const currBatTeamId = matchInfo.currBatTeamId;
                const team1 = matchInfo.team1;
                const team2 = matchInfo.team2;

                const battingTeam = currBatTeamId === team1.teamId ? team1.teamSName : team2.teamSName;
                const bowlingTeam = currBatTeamId === team1.teamId ? team2.teamSName : team1.teamSName;

                // Get current innings score
                const battingTeamScore = currBatTeamId === team1.teamId ? matchScore.team1Score : matchScore.team2Score;

                // Find the latest innings for batting team
                const inningsKeys = Object.keys(battingTeamScore || {});
                const latestInningsKey = inningsKeys[inningsKeys.length - 1];
                const currentInnings = battingTeamScore?.[latestInningsKey];

                const score = currentInnings?.runs ?? 0;
                const wickets = currentInnings?.wickets ?? 0;
                const overs = currentInnings?.overs ?? 0;

                const status = matchInfo.state || 'Live';
                const liveText = matchInfo.status || `${battingTeam} ${score}/${wickets} (${overs}) — ${status}`;

                return NextResponse.json({
                    status,
                    liveText,
                    teams: {
                        batting: { name: battingTeam, score, wickets, overs },
                        bowling: { name: bowlingTeam, score: 0, wickets: 0, overs: 0 },
                    },
                });
            }
        }

        // Fallback: Use the preview data from user's JSON (IND vs NZ T20 World Cup Final)
        return NextResponse.json({
            status: 'Preview',
            liveText: '🏆 T20 World Cup Final - Match starts at Mar 08, 13:30 GMT',
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
