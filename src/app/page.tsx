"use client";

import { useState, useEffect } from "react";
import { Guest } from "@/lib/types";
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

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('matchGameUser');
    if (saved) {
      setCurrentUser(saved as Guest);
    }
  }, []);

  const handleLogin = (guest: Guest) => {
    setCurrentUser(guest);
    localStorage.setItem('matchGameUser', guest);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('matchGameUser');
  };

  if (!isMounted) return null; // Avoid hydration mismatch

  if (!currentUser) {
    return <UserSelection onSelect={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      {/* Sticky Match Bar lives at the top */}
      <MatchBar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* Header / User Info */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Welcome, {currentUser}!</h2>
            <p className="text-slate-500">Make your predictions and climb the leaderboard.</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-red-500 hover:text-red-700 font-medium px-4 py-2 hover:bg-red-50 rounded-lg transition-colors"
          >
            Change User
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-8 w-full max-w-sm mx-auto sm:mx-0">
          <button
            onClick={() => setActiveTab('predict')}
            className={clsx(
              "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200",
              activeTab === 'predict'
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
            )}
          >
            <CheckSquare className="w-4 h-4" />
            Predictions
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={clsx(
              "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200",
              activeTab === 'leaderboard'
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
            )}
          >
            <Trophy className="w-4 h-4" />
            Leaderboard
          </button>
        </div>

        {/* Dynamic Content */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'predict' ? (
            <PredictionForm currentUser={currentUser} />
          ) : (
            <Leaderboard currentUser={currentUser} />
          )}
        </div>

      </main>
    </div>
  );
}
