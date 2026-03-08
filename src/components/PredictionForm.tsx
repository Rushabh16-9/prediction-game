"use client";

import { useState, useEffect } from "react";
import { Guest, MatchScore } from "@/lib/types";
import { QUESTIONS } from "@/lib/constants";
import { CheckCircle, ChevronRight, Loader2, Lock } from "lucide-react";
import clsx from "clsx";

interface Props {
    currentUser: Guest;
}

const CATEGORY_ICONS: Record<string, string> = {
    'PRE-MATCH': '🏏',
    'INDIAN BATTING phase': '🏅',
    'INDIAN BOWLING phase': '⚡',
    'NEW ZEALAND (Common)': '🥝',
    'MATCH FIELDING & RESULTS': '🏆',
};

const CATEGORY_COLORS: Record<string, string> = {
    'PRE-MATCH': 'from-purple-600 to-purple-700',
    'INDIAN BATTING phase': 'from-blue-600 to-blue-700',
    'INDIAN BOWLING phase': 'from-indigo-600 to-indigo-800',
    'NEW ZEALAND (Common)': 'from-gray-600 to-gray-700',
    'MATCH FIELDING & RESULTS': 'from-orange-500 to-orange-600',
};

// Category order when India bats first
const ORDER_INDIA_BATS_FIRST = [
    'PRE-MATCH',
    'INDIAN BATTING phase',
    'INDIAN BOWLING phase',
    'NEW ZEALAND (Common)',
    'MATCH FIELDING & RESULTS'
];

// Category order when India bowls first
const ORDER_INDIA_BOWLS_FIRST = [
    'PRE-MATCH',
    'INDIAN BOWLING phase',  // India bowling first
    'NEW ZEALAND (Common)',  // NZ batting
    'INDIAN BATTING phase',  // India batting later
    'MATCH FIELDING & RESULTS'
];

export default function PredictionForm({ currentUser }: Props) {
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [savedPoints, setSavedPoints] = useState<number | null>(null);
    const [indiaBattingFirst, setIndiaBattingFirst] = useState<boolean | null>(null);

    useEffect(() => {
        // Load any existing predictions for this user
        const key = `predictions_${currentUser}`;
        const saved = localStorage.getItem(key);
        if (saved) {
            const parsed = JSON.parse(saved);
            setAnswers(parsed.answers || {});
            setSubmitted(parsed.submitted || false);
            setSavedPoints(parsed.totalPoints ?? null);
        }
        setInitialLoading(false);
    }, [currentUser]);

    // Fetch toss info to determine question order
    useEffect(() => {
        async function fetchTossInfo() {
            try {
                const res = await fetch('/api/live-score');
                const data: MatchScore = await res.json();
                if (data?.tossInfo?.indiaBattingFirst !== undefined) {
                    setIndiaBattingFirst(data.tossInfo.indiaBattingFirst);
                }
            } catch (err) {
                console.error('Error fetching toss info:', err);
                // Default to India batting first
                setIndiaBattingFirst(true);
            }
        }
        fetchTossInfo();
    }, []);

    const handleChange = (questionId: number, value: string) => {
        setAnswers((prev) => ({ ...prev, [questionId]: value }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/predictions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ guestName: currentUser, answers }),
            });
            const data = await res.json();
            if (res.ok) {
                const key = `predictions_${currentUser}`;
                localStorage.setItem(key, JSON.stringify({ answers, submitted: true, totalPoints: data.totalPoints ?? null }));
                setSubmitted(true);
                setSavedPoints(data.totalPoints ?? null);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Sort categories based on toss result
    const categoryOrder = indiaBattingFirst === false ? ORDER_INDIA_BOWLS_FIRST : ORDER_INDIA_BATS_FIRST;
    
    // Sort questions by our custom order
    const sortedQuestions = [...QUESTIONS].sort((a, b) => {
        const orderA = categoryOrder.indexOf(a.category);
        const orderB = categoryOrder.indexOf(b.category);
        if (orderA !== orderB) return orderA - orderB;
        return a.id - b.id;
    });

    // Group sorted questions by category
    const answeredCount = Object.keys(answers).length;
    const totalQuestions = QUESTIONS.length;
    const progress = Math.round((answeredCount / totalQuestions) * 100);

    const categories = categoryOrder;

    // Build category questions map from sorted questions
    const getCategoryQuestions = (category: string) => {
        return sortedQuestions.filter((q) => q.category === category);
    };

    if (initialLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-6 text-center">
                <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-14 h-14 text-green-500" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800">Predictions Submitted!</h2>
                <p className="text-slate-500 max-w-md">
                    Your {totalQuestions} predictions have been locked in, {currentUser}. Check the leaderboard to see your standing!
                </p>
                {savedPoints !== null && (
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl px-8 py-4">
                        <p className="text-blue-600 font-semibold text-lg">Current Points: <span className="text-3xl font-black">{savedPoints}</span></p>
                    </div>
                )}
                <div className="flex items-center gap-2 text-slate-400 text-sm mt-2">
                    <Lock className="w-4 h-4" />
                    Predictions are locked. Results update in real-time.
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Toss Info Banner */}
            {indiaBattingFirst !== null && (
                <div className={`rounded-xl p-4 text-center ${indiaBattingFirst ? 'bg-blue-50 border border-blue-200' : 'bg-orange-50 border border-orange-200'}`}>
                    <p className={`font-semibold ${indiaBattingFirst ? 'text-blue-700' : 'text-orange-700'}`}>
                        {indiaBattingFirst ? '🏏 India BATTING First' : '⚡ India BOWLING First'}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">Questions are ordered based on match flow</p>
                </div>
            )}

            {/* Progress Bar */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-semibold text-slate-600">Prediction Progress</span>
                    <span className="text-sm font-bold text-blue-600">{answeredCount}/{totalQuestions} answered</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-orange-400 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Question Categories */}
            {categories.map((category) => {
                const catQuestions = getCategoryQuestions(category);
                // Skip empty categories
                if (catQuestions.length === 0) return null;
                
                const catAnswered = catQuestions.filter((q) => answers[q.id] !== undefined && answers[q.id] !== "").length;
                const icon = CATEGORY_ICONS[category] || '📋';
                const colorClass = CATEGORY_COLORS[category] || 'from-blue-600 to-blue-700';

                return (
                    <div key={category} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        {/* Category Header */}
                        <div className={`bg-gradient-to-r ${colorClass} p-5 flex items-center justify-between`}>
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{icon}</span>
                                <h3 className="text-lg font-bold text-white tracking-tight">{category.toUpperCase()}</h3>
                            </div>
                            <span className="text-xs font-semibold text-white/80 bg-white/10 px-3 py-1 rounded-full">
                                {catAnswered}/{catQuestions.length}
                            </span>
                        </div>

                        {/* Questions */}
                        <div className="divide-y divide-slate-50">
                            {catQuestions.map((q) => (
                                <div key={q.id} className="p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-start gap-3">
                                            <span className="mt-0.5 w-7 h-7 rounded-full bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center shrink-0">
                                                {q.id}
                                            </span>
                                            <div>
                                                <p className="font-semibold text-slate-800 text-sm sm:text-base">{q.text}</p>
                                                <p className="text-xs text-slate-400 mt-0.5">+{q.points} pts on correct</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="sm:w-48 pl-10 sm:pl-0">
                                        {q.type === 'select' && q.options ? (
                                            <select
                                                value={answers[q.id] ?? ''}
                                                onChange={(e) => handleChange(q.id, e.target.value)}
                                                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-sm font-medium focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                                            >
                                                <option value="">-- Select --</option>
                                                {q.options.map((opt) => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        ) : q.type === 'number' ? (
                                            <input
                                                type="number"
                                                min={0}
                                                placeholder="e.g. 42"
                                                value={answers[q.id] ?? ''}
                                                onChange={(e) => handleChange(q.id, e.target.value)}
                                                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-sm font-medium focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                                            />
                                        ) : (
                                            <input
                                                type="text"
                                                placeholder="Type your answer..."
                                                value={answers[q.id] ?? ''}
                                                onChange={(e) => handleChange(q.id, e.target.value)}
                                                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-sm font-medium focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                                            />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}

            {/* Submit Button */}
            <div className="sticky bottom-4 flex justify-center pb-2">
                <button
                    onClick={handleSubmit}
                    disabled={loading || answeredCount < totalQuestions}
                    className={clsx(
                        "flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-white text-base shadow-lg transition-all duration-300",
                        answeredCount === totalQuestions
                            ? "bg-gradient-to-r from-blue-600 to-blue-800 hover:scale-[1.02] hover:shadow-xl active:scale-95"
                            : "bg-slate-300 cursor-not-allowed"
                    )}
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <ChevronRight className="w-5 h-5" />
                    )}
                    {loading ? "Submitting..." : answeredCount < totalQuestions ? `Answer all ${totalQuestions - answeredCount} remaining` : "🏏 Lock in Predictions!"}
                </button>
            </div>
        </div>
    );
}
