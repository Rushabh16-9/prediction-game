"use client";

import { useState, useEffect } from "react";
import { Guest } from "@/lib/types";
import { GUESTS } from "@/lib/constants";
import { Trophy, Medal, RefreshCw, User } from "lucide-react";
import clsx from "clsx";

interface LeaderboardEntry {
    name: Guest;
    totalPoints: number;
    answeredCount: number;
}

interface Props {
    currentUser: Guest;
}

const MEDAL_COLORS = ['text-yellow-400', 'text-slate-400', 'text-amber-600'];
const MEDAL_BG = ['bg-yellow-50 border-yellow-200', 'bg-slate-50 border-slate-200', 'bg-amber-50 border-amber-200'];

export default function Leaderboard({ currentUser }: Props) {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const fetchLeaderboard = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/leaderboard');
            const data = await res.json();
            if (data.leaderboard) {
                setEntries(data.leaderboard);
                setLastUpdated(new Date());
            }
        } catch (err) {
            console.error("Failed to fetch leaderboard:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaderboard();
        const interval = setInterval(fetchLeaderboard, 30000); // Refresh every 30s
        return () => clearInterval(interval);
    }, []);

    const maxPoints = entries.length > 0 ? Math.max(...entries.map(e => e.totalPoints)) : 1;

    return (
        <div className="space-y-5">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                            <Trophy className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Live Leaderboard</h2>
                            <p className="text-xs text-slate-400">
                                {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : 'Fetching...'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={fetchLeaderboard}
                        disabled={loading}
                        className="p-2.5 rounded-xl hover:bg-slate-100 transition-colors"
                    >
                        <RefreshCw className={clsx("w-4 h-4 text-slate-500", loading && "animate-spin")} />
                    </button>
                </div>

                {loading && entries.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
                        <RefreshCw className="w-8 h-8 animate-spin" />
                        <p className="text-sm font-medium">Loading standings...</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {entries.map((entry, index) => {
                            const isCurrentUser = entry.name === currentUser;
                            const rank = index + 1;
                            const barWidth = maxPoints > 0 ? (entry.totalPoints / maxPoints) * 100 : 0;

                            return (
                                <div
                                    key={entry.name}
                                    className={clsx(
                                        "relative flex items-center gap-4 p-4 rounded-xl border transition-all duration-300",
                                        isCurrentUser
                                            ? "bg-blue-50 border-blue-300 ring-2 ring-blue-200"
                                            : rank <= 3
                                                ? MEDAL_BG[rank - 1]
                                                : "bg-slate-50 border-slate-100"
                                    )}
                                >
                                    {/* Rank */}
                                    <div className="w-10 text-center shrink-0">
                                        {rank <= 3 ? (
                                            <Medal className={clsx("w-7 h-7 mx-auto", MEDAL_COLORS[rank - 1])} />
                                        ) : (
                                            <span className="text-lg font-black text-slate-400">#{rank}</span>
                                        )}
                                    </div>

                                    {/* Name & Bar */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <div className="flex items-center gap-2">
                                                <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                <span className={clsx(
                                                    "font-bold text-sm sm:text-base truncate",
                                                    isCurrentUser ? "text-blue-700" : "text-slate-700"
                                                )}>
                                                    {entry.name}
                                                    {isCurrentUser && <span className="ml-1.5 text-xs font-semibold text-blue-500">(You)</span>}
                                                </span>
                                            </div>
                                            <span className={clsx(
                                                "font-black text-lg shrink-0 ml-2",
                                                rank === 1 ? "text-yellow-500" : isCurrentUser ? "text-blue-600" : "text-slate-700"
                                            )}>
                                                {entry.totalPoints} <span className="text-xs font-normal text-slate-400">pts</span>
                                            </span>
                                        </div>

                                        {/* Progress bar */}
                                        <div className="w-full h-2 bg-white/70 rounded-full overflow-hidden border border-slate-100">
                                            <div
                                                className={clsx(
                                                    "h-full rounded-full transition-all duration-700",
                                                    rank === 1 ? "bg-gradient-to-r from-yellow-400 to-yellow-500"
                                                        : isCurrentUser ? "bg-gradient-to-r from-blue-500 to-blue-600"
                                                            : "bg-gradient-to-r from-slate-300 to-slate-400"
                                                )}
                                                style={{ width: `${barWidth}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-slate-400 mt-1">{entry.answeredCount}/30 answered</p>
                                    </div>
                                </div>
                            );
                        })}

                        {entries.length === 0 && !loading && (
                            <div className="text-center py-10 text-slate-400">
                                <Trophy className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                <p className="font-medium">No predictions locked in yet.</p>
                                <p className="text-sm">Be the first to submit!</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
