"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Suggestion {
    word: string;
    entropy: number;
    isPossible: boolean;
}

interface SuggestionsListProps {
    suggestions: Suggestion[];
    isCalculating: boolean;
    onSelect: (word: string) => void;
}

export function SuggestionsList({ suggestions, isCalculating, onSelect }: SuggestionsListProps) {
    const winningGuesses = suggestions.filter(s => s.isPossible);
    const strategicGuesses = suggestions.filter(s => !s.isPossible);

    return (
        <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl h-full overflow-hidden">
            <CardHeader className="bg-primary/5 border-b border-border/20">
                <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-400" />
                    Best Next Moves
                </CardTitle>
                <CardDescription>
                    Entropy-optimized suggestions.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-6">
                {isCalculating ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
                        <span className="text-sm font-medium tracking-wide">Analyzing patterns...</span>
                    </div>
                ) : (
                    <>
                        {winningGuesses.length > 0 && (
                            <div className="space-y-2">
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-emerald-500/70 mb-2 px-1">Winning Guesses</h3>
                                {winningGuesses.map((s, i) => (
                                    <SuggestionItem key={i} s={s} onSelect={onSelect} />
                                ))}
                            </div>
                        )}

                        {strategicGuesses.length > 0 && (
                            <div className="space-y-2">
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 px-1">Elimination Guesses</h3>
                                {strategicGuesses.slice(0, winningGuesses.length > 0 ? 5 : 10).map((s, i) => (
                                    <SuggestionItem key={i} s={s} onSelect={onSelect} />
                                ))}
                            </div>
                        )}
                        
                        {suggestions.length === 0 && (
                            <div className="text-center py-12 text-muted-foreground text-sm">
                                No moves found. Check your grid colors.
                            </div>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
}

function SuggestionItem({ s, onSelect }: { s: Suggestion; onSelect: (word: string) => void }) {
    return (
        <div 
            className={cn(
                "group flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer shadow-sm",
                s.isPossible 
                    ? "bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/60" 
                    : "bg-background/40 border-border/30 hover:border-primary/30"
            )}
            onClick={() => onSelect(s.word)}
        >
            <div className="flex flex-col gap-0.5">
                <span className={cn(
                    "text-lg font-bold font-mono tracking-widest uppercase transition-colors",
                    s.isPossible ? "text-emerald-400" : "text-foreground group-hover:text-primary"
                )}>
                    {s.word}
                </span>
                <span className="text-[9px] text-muted-foreground font-medium uppercase tracking-tighter">
                    {s.isPossible ? "Could be the answer" : "Narrow down options"}
                </span>
            </div>
            <div className="text-right flex flex-col items-end">
                <div className="flex items-baseline gap-1">
                    <span className="text-base font-bold text-emerald-400">{s.entropy.toFixed(2)}</span>
                    <span className="text-[9px] text-muted-foreground font-medium">bits</span>
                </div>
            </div>
        </div>
    );
}
