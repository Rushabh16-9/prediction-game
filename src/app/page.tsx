"use client";

import { useState, useEffect } from "react";
import { Guest, MatchScore } from "@/lib/types";
import UserSelection from "@/components/UserSelection";
import MatchBar from "@/components/MatchBar";
import PredictionForm from "@/components/PredictionForm";
import Leaderboard from "@/components/Leaderboard";
import { Trophy, CheckSquare } from "lucide-react";
import clsx from "clsx";

export default function Home() {
  const [currentUser, setCurrentUser] = useState<Guest | null>(null);
  const [activeTab, setActiveTab] = useState<'predict' | 'leaderboard'>('predict');
  const [isMounted, setIsMounted] = useState(false);
  const [score, setScore] = useState<MatchScore | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('matchGameUser');
    if (saved) {
      setCurrentUser(saved as Guest);
      // Re-claim the session in case server restarted
      fetch('/api/active-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: saved }),
      }).catch(() => { }); // Ignore 409 (already claimed) or errors
    }
  }, []);

  const handleLogin = (guest: Guest) => {
    setCurrentUser(guest);
    localStorage.setItem('matchGameUser', guest);
    // Session already claimed in UserSelection before calling this
  };

  const handleLogout = async () => {
    const name = currentUser;
    setCurrentUser(null);
    localStorage.removeItem('matchGameUser');
    // Release the session so others can claim this name
    if (name) {
      try {
        await fetch('/api/active-sessions', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name }),
        });
      } catch { /* ignore */ }
    }
  };

  if (!isMounted) return null; // Avoid hydration mismatch

  if (!currentUser) {
    return <UserSelection onSelect={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24">
      {/* Sticky Match Bar */}
      <MatchBar onScoreUpdate={setScore} />

      <main className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 pt-5 sm:pt-8">

        {/* Header / User Info */}
        <div className="flex items-center justify-between mb-5 sm:mb-8 gap-3 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="min-w-0">
            <h2 className="text-lg sm:text-2xl font-bold text-slate-800 truncate">Welcome, {currentUser}! 👋</h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">Make your predictions and climb the leaderboard.</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs sm:text-sm text-red-500 hover:text-red-700 font-medium px-3 py-2 hover:bg-red-50 rounded-lg transition-colors shrink-0 touch-manipulation"
          >
            Change User
          </button>
        </div>

        {/* Tab Navigation – full width on mobile */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-5 sm:mb-8 w-full">
          <button
            onClick={() => setActiveTab('predict')}
            className={clsx(
              "flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-2 sm:px-4 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-200",
              activeTab === 'predict'
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
            )}
          >
            <CheckSquare className="w-4 h-4 shrink-0" />
            Predictions
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={clsx(
              "flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-2 sm:px-4 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-200",
              activeTab === 'leaderboard'
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
            )}
          >
            <Trophy className="w-4 h-4 shrink-0" />
            Leaderboard
          </button>
        </div>

        {/* Dynamic Content */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'predict' ? (
            <PredictionForm currentUser={currentUser} />
          ) : (
            <Leaderboard currentUser={currentUser} score={score} />
          )}
        </div>

      </main>
    </div>
  );
}
