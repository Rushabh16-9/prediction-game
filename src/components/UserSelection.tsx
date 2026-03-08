"use client";

import { Guest } from "@/lib/types";
import { GUESTS } from "@/lib/constants";
import { User, LogIn } from "lucide-react";

interface Props {
    onSelect: (guest: Guest) => void;
}

export default function UserSelection({ onSelect }: Props) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 flex flex-col items-center justify-center p-3 sm:p-4">
            <div className="max-w-3xl w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl">
                <div className="text-center mb-6 sm:mb-10">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-3 sm:mb-4 tracking-tight leading-tight">
                        Cricket <span className="text-orange-400">Prediction</span> Game
                    </h1>
                    <p className="text-blue-100/80 text-sm sm:text-lg">Select your name to enter and make your predictions!</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                    {GUESTS.map((guest) => (
                        <button
                            key={guest}
                            onClick={() => onSelect(guest)}
                            className="flex items-center justify-center gap-2 min-h-[52px] py-3 px-3 sm:px-6 bg-white/5 hover:bg-white/20 border border-white/10 hover:border-white/30 rounded-xl transition-all duration-300 text-white font-semibold text-sm sm:text-lg hover:scale-105 active:scale-95 touch-manipulation group"
                        >
                            <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300 group-hover:text-orange-400 transition-colors shrink-0" />
                            <span className="truncate">{guest}</span>
                        </button>
                    ))}
                </div>

                <div className="mt-8 sm:mt-12 text-center text-white/50 text-xs sm:text-sm flex items-center justify-center gap-2">
                    <LogIn className="w-4 h-4" />
                    Only invited guests can participate
                </div>
            </div>
        </div>
    );
}
