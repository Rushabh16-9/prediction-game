"use client";

import { Guest } from "@/lib/types";
import { GUESTS } from "@/lib/constants";
import { User, LogIn } from "lucide-react";

interface Props {
    onSelect: (guest: Guest) => void;
}

export default function UserSelection({ onSelect }: Props) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 flex flex-col items-center justify-center p-4">
            <div className="max-w-3xl w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
                        Cricket <span className="text-orange-400">Prediction</span> World Cup
                    </h1>
                    <p className="text-blue-100/80 text-lg">Select your name to enter the arena and make your predictions!</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {GUESTS.map((guest) => (
                        <button
                            key={guest}
                            onClick={() => onSelect(guest)}
                            className="flex items-center justify-center gap-2 py-4 px-6 bg-white/5 hover:bg-white/20 border border-white/10 hover:border-white/30 rounded-xl transition-all duration-300 text-white font-semibold text-lg hover:scale-105 active:scale-95 group"
                        >
                            <User className="w-5 h-5 text-blue-300 group-hover:text-orange-400 transition-colors" />
                            {guest}
                        </button>
                    ))}
                </div>

                <div className="mt-12 text-center text-white/50 text-sm flex items-center justify-center gap-2">
                    <LogIn className="w-4 h-4" />
                    Only invited guests can participate
                </div>
            </div>
        </div>
    );
}
