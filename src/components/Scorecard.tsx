"use client";

import { MatchScore } from "@/lib/types";
import { Users, Target, TrendingUp } from "lucide-react";

interface ScorecardProps {
  score: MatchScore | null;
}

export default function Scorecard({ score }: ScorecardProps) {
  if (!score || !score.scorecard) {
    return null;
  }

  const { currentBatsmen, currentBowler, partnership, recentOvers } = score.scorecard;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
      {/* Current Batsmen */}
      {currentBatsmen && currentBatsmen.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 shrink-0" />
            Current Batsmen
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentBatsmen.map((batsman, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border-2 ${batsman.isStriker
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-300 bg-gray-50"
                  }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-bold text-gray-800">{batsman.name}</p>
                    {batsman.isStriker && (
                      <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded">
                        Striker
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">{batsman.runs}</p>
                    <p className="text-xs text-gray-500">({batsman.balls})</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm text-gray-700">
                  <div>
                    <p className="text-gray-500 text-xs">4s</p>
                    <p className="font-semibold">{batsman.fours}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">6s</p>
                    <p className="font-semibold">{batsman.sixes}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">SR</p>
                    <p className="font-semibold">{batsman.strikeRate.toFixed(1)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current Bowler */}
      {currentBowler && (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 shrink-0" />
            Current Bowler
          </h2>
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 sm:p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-2xl font-bold text-gray-800">{currentBowler.name}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Wickets</p>
                <p className="text-3xl font-bold text-red-600">{currentBowler.wickets}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4">
              <div>
                <p className="text-gray-500 text-xs">Overs</p>
                <p className="text-lg font-semibold text-gray-800">{currentBowler.overs}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Maidens</p>
                <p className="text-lg font-semibold text-gray-800">{currentBowler.maidens}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Runs</p>
                <p className="text-lg font-semibold text-gray-800">{currentBowler.runs}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Economy</p>
                <p className="text-lg font-semibold text-gray-800">{currentBowler.economy.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Avg</p>
                <p className="text-lg font-semibold text-gray-800">
                  {currentBowler.wickets > 0
                    ? (currentBowler.runs / currentBowler.wickets).toFixed(1)
                    : "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Partnership */}
      {partnership && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Current Partnership
          </h2>
          <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-gray-500 text-sm">Runs</p>
                <p className="text-3xl font-bold text-green-600">{partnership.runs}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Balls</p>
                <p className="text-3xl font-bold text-green-600">{partnership.balls}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Strike Rate</p>
                <p className="text-3xl font-bold text-green-600">
                  {partnership.balls > 0
                    ? ((partnership.runs / partnership.balls) * 100).toFixed(1)
                    : "0"}
                </p>
              </div>
            </div>
            {partnership.batsmen && partnership.batsmen.length > 0 && (
              <div className="mt-4 pt-4 border-t border-green-200">
                <p className="text-sm text-gray-600 mb-2">Between:</p>
                <p className="text-gray-800 font-semibold">{partnership.batsmen.join(" & ")}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recent Overs */}
      {recentOvers && recentOvers.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Recent Overs</h2>
          <div className="space-y-2">
            {recentOvers.map((over, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-semibold text-gray-700">Over {idx + 1}</span>
                <span className="text-gray-600 font-mono text-sm">{over}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
