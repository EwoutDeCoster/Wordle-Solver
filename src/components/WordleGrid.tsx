"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Feedback, Pattern } from '@/lib/wordle';

interface GuessRow {
    word: string;
    pattern: Pattern;
}

interface WordleGridProps {
    guesses: GuessRow[];
    currentWord: string;
    onToggleCell: (rowIndex: number, cellIndex: number) => void;
}

export function WordleGrid({ guesses, currentWord, onToggleCell }: WordleGridProps) {
    return (
        <div className="grid gap-3">
            {guesses.map((guess, rowIndex) => (
                <div key={rowIndex} className="flex gap-2">
                    {guess.word.split('').map((letter, cellIndex) => (
                        <button
                            key={cellIndex}
                            onClick={() => onToggleCell(rowIndex, cellIndex)}
                            className={cn(
                                "w-12 h-12 md:w-16 md:h-16 flex items-center justify-center text-2xl font-bold uppercase border-2 transition-all duration-300 rounded-xl shadow-lg",
                                guess.pattern[cellIndex] === 2 && "bg-wordle-correct border-wordle-correct text-white shadow-emerald-500/20",
                                guess.pattern[cellIndex] === 1 && "bg-wordle-present border-wordle-present text-white shadow-yellow-500/20",
                                guess.pattern[cellIndex] === 0 && "bg-wordle-absent border-wordle-absent text-white shadow-black/20"
                            )}
                        >
                            {letter}
                        </button>
                    ))}
                </div>
            ))}
            
            {/* Current Typing Row */}
            {guesses.length < 6 && (
                <div className="flex gap-2">
                    {[0, 1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className={cn(
                                "w-12 h-12 md:w-16 md:h-16 flex items-center justify-center text-2xl font-bold uppercase border-2 rounded-xl transition-all shadow-inner",
                                currentWord[i] ? "border-emerald-500/50 bg-emerald-500/5" : "border-border/30 bg-muted/5"
                            )}
                        >
                            {currentWord[i] || ''}
                        </div>
                    ))}
                </div>
            )}

            {/* Empty Rows */}
            {Array.from({ length: Math.max(0, 5 - guesses.length) }).map((_, i) => (
                <div key={i} className="flex gap-2 opacity-20">
                    {[0, 1, 2, 3, 4].map((j) => (
                        <div key={j} className="w-12 h-12 md:w-16 md:h-16 border-2 border-border/30 rounded-xl" />
                    ))}
                </div>
            ))}
        </div>
    );
}
