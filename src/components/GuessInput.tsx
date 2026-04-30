"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, RotateCcw } from 'lucide-react';

interface GuessInputProps {
    value: string;
    onChange: (value: string) => void;
    onAdd: () => void;
    onUndo: () => void;
    onReset: () => void;
    disabledUndo: boolean;
}

export function GuessInput({ value, onChange, onAdd, onUndo, onReset, disabledUndo }: GuessInputProps) {
    return (
        <div className="w-full max-w-sm space-y-4">
            <div className="flex gap-2">
                <input
                    type="text"
                    maxLength={5}
                    value={value}
                    onChange={(e) => onChange(e.target.value.replace(/[^a-zA-Z]/g, '').toLowerCase())}
                    onKeyDown={(e) => e.key === 'Enter' && onAdd()}
                    placeholder="Type guess..."
                    className="flex-1 bg-background/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 uppercase font-mono tracking-widest shadow-sm transition-all"
                />
                <Button 
                    onClick={onAdd} 
                    disabled={value.length !== 5} 
                    className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl px-6 shadow-lg shadow-emerald-900/20 transition-all"
                >
                    Add
                </Button>
            </div>
            <div className="flex justify-between gap-3">
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={onUndo} 
                    disabled={disabledUndo} 
                    className="flex-1 rounded-xl border-border/50 hover:bg-muted/50 transition-all"
                >
                    <Trash2 className="w-4 h-4 mr-2" /> Undo
                </Button>
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={onReset} 
                    className="flex-1 rounded-xl border-border/50 hover:bg-muted/50 transition-all"
                >
                    <RotateCcw className="w-4 h-4 mr-2" /> Reset
                </Button>
            </div>
        </div>
    );
}
