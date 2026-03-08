"use client";

import { useState, useEffect, useRef } from "react";
import { MatchScore } from "@/lib/types";
import { Activity, Radio, Volume2, VolumeX } from "lucide-react";
import confetti from "canvas-confetti";

export default function MatchBar() {
    const [score, setScore] = useState<MatchScore | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [loading, setLoading] = useState(true);

    // Keep track of previous score to detect events (4s, 6s, Wickets)
    const prevScoreRef = useRef<MatchScore | null>(null);

    // Sound refs (Normally we might want actual mp3s in public dir)
    // For safety and self-containment without files, we can use simple Web Audio API beeps, 
    // or placeholder audio objects if files existed. Let's assume files are added later.

    const playSoundEffect = (type: 'four' | 'six' | 'wicket') => {
        if (isMuted) return;

        // Fallback simple browser beep if no mp3
        try {
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            if (type === 'four') {
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
                gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
                oscillator.start();
                oscillator.stop(audioCtx.currentTime + 0.5);
            } else if (type === 'six') {
                oscillator.type = 'triangle';
                oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
                gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
                oscillator.start();
                oscillator.stop(audioCtx.currentTime + 0.8);

                // Confetti for 6!
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.1 },
                    colors: ['#004de6', '#ffffff', '#ff9933', '#138808'] // India colors
                });
            } else if (type === 'wicket') {
                oscillator.type = 'sawtooth';
                oscillator.frequency.setValueAtTime(150, audioCtx.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.5);
                gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
                oscillator.start();
                oscillator.stop(audioCtx.currentTime + 0.5);
            }
        } catch (e) {
            console.warn("Audio Context failed", e);
        }
    };

    const fetchScore = async () => {
        try {
            const res = await fetch('/api/live-score');
            const data = await res.json();

            if (data && data.status) {
                setScore(data);

                // Logic to detect changes and play sound
                if (prevScoreRef.current) {
                    const prev = prevScoreRef.current;
                    const curr = data;

                    // Check wickets
                    const prevWickets = prev.teams.batting.wickets;
                    const currWickets = curr.teams.batting.wickets;
                    if (currWickets > prevWickets) {
                        playSoundEffect('wicket');
                    }

                    // Check runs (Very simplified detection for 4 and 6)
                    const prevRuns = prev.teams.batting.score;
                    const currRuns = curr.teams.batting.score;
                    const runDiff = currRuns - prevRuns;

                    if (runDiff === 4) {
                        playSoundEffect('four');
                    } else if (runDiff === 6) {
                        playSoundEffect('six');
                    }
                }

                prevScoreRef.current = data;
            }
        } catch (err) {
            console.error("Error fetching score:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchScore(); // Initial fetch

        // Poll every 2 seconds for T20 excitement
        const interval = setInterval(fetchScore, 2000);
        return () => clearInterval(interval);
    }, [isMuted]);

    return (
        <div className="sticky top-0 z-50 w-full bg-[#004de6] text-white shadow-lg border-b-4 border-orange-400">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center">
                        <Radio className="w-5 h-5 text-red-400 z-10" />
                        <span className="absolute animate-ping inline-flex h-full w-full rounded-full bg-red-400 opacity-40"></span>
                    </div>
                    <span className="font-bold tracking-wider text-sm hidden sm:inline-block">LIVE</span>
                </div>

                <div className="flex-1 flex justify-center">
                    {loading ? (
                        <div className="flex items-center gap-2 text-white/70">
                            <Activity className="w-4 h-4 animate-spin" />
                            <span className="text-sm font-medium">Fetching Score...</span>
                        </div>
                    ) : score ? (
                        <div className="flex items-center gap-4">
                            <div className="text-lg md:text-xl font-black tracking-tight flex items-center gap-2">
                                <span className="text-orange-300">{score.teams.batting.name}</span>
                                <span>{score.teams.batting.score}/{score.teams.batting.wickets}</span>
                                <span className="text-sm font-normal text-white/70">({score.teams.batting.overs})</span>
                            </div>
                            <div className="hidden md:block w-px h-6 bg-white/20"></div>
                            <div className="text-sm text-white/80 hidden md:block max-w-xs truncate">
                                {score.liveText}
                            </div>
                        </div>
                    ) : (
                        <div className="text-sm font-medium text-white/70">Match data unavailable</div>
                    )}
                </div>

                <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    title={isMuted ? "Unmute sounds" : "Mute sounds"}
                >
                    {isMuted ? <VolumeX className="w-5 h-5 text-white/60" /> : <Volume2 className="w-5 h-5" />}
                </button>
            </div>
        </div>
    );
}
