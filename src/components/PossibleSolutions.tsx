"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from 'lucide-react';

interface PossibleSolutionsProps {
    solutions: string[];
    onSelect: (word: string) => void;
}

export function PossibleSolutions({ solutions, onSelect }: PossibleSolutionsProps) {
    if (solutions.length === 0 || solutions.length > 200) return null;

    return (
        <Card className="border-border/40 bg-card/30 backdrop-blur-md shadow-xl overflow-hidden">
            <CardHeader className="bg-emerald-500/5 border-b border-border/20">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-emerald-400">
                    <Search className="w-4 h-4" />
                    Possible Solutions ({solutions.length})
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
                <div className="flex flex-wrap gap-2">
                    {solutions.slice(0, 50).map((word) => (
                        <span 
                            key={word} 
                            className="px-2 py-1 bg-muted/30 border border-border/30 rounded text-xs font-mono uppercase tracking-wider cursor-pointer hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-colors"
                            onClick={() => onSelect(word)}
                        >
                            {word}
                        </span>
                    ))}
                    {solutions.length > 50 && (
                        <span className="text-xs text-muted-foreground flex items-center px-2">
                            + {solutions.length - 50} more...
                        </span>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
