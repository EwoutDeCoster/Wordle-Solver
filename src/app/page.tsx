"use client";

import React, { useState, useEffect } from 'react';
import { SOLUTIONS, ALL_GUESSES } from '@/data/words';
import { filterWords, getSuggestions, Pattern, Feedback } from '@/lib/wordle';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Search } from 'lucide-react';

// Components
import { WordleGrid } from '@/components/WordleGrid';
import { GuessInput } from '@/components/GuessInput';
import { SuggestionsList } from '@/components/SuggestionsList';
import { PossibleSolutions } from '@/components/PossibleSolutions';

interface GuessRow {
    word: string;
    pattern: Pattern;
}

export default function WordleSolver() {
    const [guesses, setGuesses] = useState<GuessRow[]>([]);
    const [currentWord, setCurrentWord] = useState('');
    const [remainingSolutions, setRemainingSolutions] = useState(SOLUTIONS);
    const [suggestions, setSuggestions] = useState<{ word: string; entropy: number; isPossible: boolean }[]>([]);
    const [isCalculating, setIsCalculating] = useState(false);

    // Initial suggestions
    useEffect(() => {
        if (guesses.length === 0) {
            setSuggestions([
                { word: 'salet', entropy: 5.76, isPossible: true },
                { word: 'crane', entropy: 5.74, isPossible: true },
                { word: 'trace', entropy: 5.73, isPossible: true },
                { word: 'roate', entropy: 5.71, isPossible: true },
                { word: 'slate', entropy: 5.70, isPossible: true },
            ]);
        }
    }, [guesses]);

    const updateSuggestions = async (solutions: string[]) => {
        if (solutions.length === 0) {
            setSuggestions([]);
            return;
        }
        setIsCalculating(true);
        setTimeout(async () => {
            const results = await getSuggestions(solutions, ALL_GUESSES, 10);
            setSuggestions(results);
            setIsCalculating(false);
        }, 100);
    };

    const handleAddGuess = () => {
        if (currentWord.length !== 5) return;
        const newRow: GuessRow = {
            word: currentWord.toLowerCase(),
            pattern: [0, 0, 0, 0, 0]
        };
        const newGuesses = [...guesses, newRow];
        setGuesses(newGuesses);
        setCurrentWord('');
    };

    const toggleCell = (rowIndex: number, cellIndex: number) => {
        const newGuesses = [...guesses];
        const currentPattern = [...newGuesses[rowIndex].pattern];
        currentPattern[cellIndex] = ((currentPattern[cellIndex] + 1) % 3) as Feedback;
        newGuesses[rowIndex].pattern = currentPattern as Pattern;
        setGuesses(newGuesses);

        let filtered = SOLUTIONS;
        for (const g of newGuesses) {
            filtered = filterWords(filtered, g.word, g.pattern);
        }
        setRemainingSolutions(filtered);
        updateSuggestions(filtered);
    };

    const handleReset = () => {
        setGuesses([]);
        setCurrentWord('');
        setRemainingSolutions(SOLUTIONS);
        setSuggestions([]);
    };

    const removeLastGuess = () => {
        const newGuesses = guesses.slice(0, -1);
        setGuesses(newGuesses);
        let filtered = SOLUTIONS;
        for (const g of newGuesses) {
            filtered = filterWords(filtered, g.word, g.pattern);
        }
        setRemainingSolutions(filtered);
        updateSuggestions(filtered);
    };

    return (
        <div className="min-h-screen bg-background text-foreground p-4 md:p-8 flex flex-col items-center">
            <header className="mb-12 text-center">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-2 bg-gradient-to-r from-blue-400 via-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                    WORDLE SOLVER
                </h1>
                <p className="text-muted-foreground max-w-md mx-auto text-sm md:text-base">
                    The ultimate information-theory assistant for Wordle.
                </p>
            </header>

            <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-6xl">
                {/* Left: Input & Grid */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-2xl overflow-hidden">
                        <CardHeader className="border-b border-border/10 bg-primary/5">
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Search className="w-5 h-5 text-emerald-400" />
                                Game State
                            </CardTitle>
                            <CardDescription>
                                Input your guesses and match the colors.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center gap-10 p-8 md:p-12">
                            <WordleGrid 
                                guesses={guesses} 
                                currentWord={currentWord} 
                                onToggleCell={toggleCell} 
                            />

                            <GuessInput 
                                value={currentWord}
                                onChange={setCurrentWord}
                                onAdd={handleAddGuess}
                                onUndo={removeLastGuess}
                                onReset={handleReset}
                                disabledUndo={guesses.length === 0}
                            />
                        </CardContent>
                    </Card>

                    <PossibleSolutions 
                        solutions={remainingSolutions} 
                        onSelect={setCurrentWord} 
                    />
                </div>

                {/* Right: Suggestions */}
                <div className="space-y-6">
                    <SuggestionsList 
                        suggestions={suggestions} 
                        isCalculating={isCalculating} 
                        onSelect={(word) => {
                            if (guesses.length < 6) setCurrentWord(word);
                        }} 
                    />
                </div>
            </main>

            <footer className="mt-16 text-muted-foreground text-xs flex flex-wrap justify-center gap-6 pb-12">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-wordle-correct/10 border border-wordle-correct/20 text-wordle-correct">
                    <div className="w-2 h-2 rounded-full bg-wordle-correct" /> Correct Position
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-wordle-present/10 border border-wordle-present/20 text-wordle-present">
                    <div className="w-2 h-2 rounded-full bg-wordle-present" /> Wrong Position
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-wordle-absent/10 border border-wordle-absent/20 text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-wordle-absent" /> Not in Word
                </div>
            </footer>
        </div>
    );
}
