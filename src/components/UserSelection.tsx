"use client";

import { useState, useEffect, useCallback } from "react";
import { Guest } from "@/lib/types";
import { GUESTS } from "@/lib/constants";
import { User, LogIn, Lock, Loader2 } from "lucide-react";

interface Props {
    onSelect: (guest: Guest) => void;
}

export default function UserSelection({ onSelect }: Props) {
    const [takenNames, setTakenNames] = useState<string[]>([]);
    const [claiming, setClaiming] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchTakenNames = useCallback(async () => {
        try {
            const res = await fetch('/api/active-sessions');
            const data = await res.json();
            setTakenNames(data.takenNames || []);
        } catch {
            // Fail silently – don't block UI
        }
    }, []);

    useEffect(() => {
        fetchTakenNames();
        // Poll every 5 seconds so the list stays fresh across devices
        const interval = setInterval(fetchTakenNames, 5000);
        return () => clearInterval(interval);
    }, [fetchTakenNames]);

    const handleSelect = async (guest: Guest) => {
        if (takenNames.includes(guest)) return;
        setClaiming(guest);
        setError(null);
        try {
            const res = await fetch('/api/active-sessions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: guest }),
            });
            if (res.status === 409) {
                // Race condition – someone just grabbed it
                setTakenNames((prev) => [...prev, guest]);
                setError(`"${guest}" was just taken. Please choose another name.`);
                setClaiming(null);
                return;
            }
            if (!res.ok) throw new Error('Failed to claim name');
            onSelect(guest);
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setClaiming(null);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 flex flex-col items-center justify-center p-3 sm:p-4">
            <div className="max-w-3xl w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl">
                <div className="text-center mb-6 sm:mb-10">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-3 sm:mb-4 tracking-tight leading-tight">
                        Cricket <span className="text-orange-400">Prediction</span> Game
                    </h1>
                    <p className="text-blue-100/80 text-sm sm:text-lg">Select your name to enter and make your predictions!</p>
                </div>

                {/* Error banner */}
                {error && (
                    <div className="mb-4 bg-red-500/20 border border-red-400/40 text-red-200 text-sm rounded-xl px-4 py-3 text-center">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                    {GUESTS.map((guest) => {
                        const isTaken = takenNames.includes(guest);
                        const isClaiming = claiming === guest;

                        return (
                            <button
                                key={guest}
                                onClick={() => handleSelect(guest)}
                                disabled={isTaken || !!claiming}
                                className={`flex items-center justify-center gap-2 min-h-[52px] py-3 px-3 sm:px-6 border rounded-xl transition-all duration-300 font-semibold text-sm sm:text-lg touch-manipulation group
                                    ${isTaken
                                        ? 'bg-white/5 border-white/5 text-white/30 cursor-not-allowed'
                                        : isClaiming
                                            ? 'bg-white/20 border-white/30 text-white scale-95 cursor-wait'
                                            : 'bg-white/5 hover:bg-white/20 border-white/10 hover:border-white/30 text-white hover:scale-105 active:scale-95'
                                    }`}
                                title={isTaken ? `${guest} is already in the game` : undefined}
                            >
                                {isClaiming ? (
                                    <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                                ) : isTaken ? (
                                    <Lock className="w-4 h-4 text-white/30 shrink-0" />
                                ) : (
                                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300 group-hover:text-orange-400 transition-colors shrink-0" />
                                )}
                                <span className="truncate">{guest}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="mt-8 sm:mt-12 text-center text-white/50 text-xs sm:text-sm flex items-center justify-center gap-2">
                    <LogIn className="w-4 h-4" />
                    Only invited guests can participate · <Lock className="w-3 h-3 inline" /> = already in game
                </div>
            </div>
        </div>
    );
}
