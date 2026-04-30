export type Feedback = 0 | 1 | 2; // 0: Gray, 1: Yellow, 2: Green
export type Pattern = Feedback[];

/**
 * Returns the feedback pattern for a guess given a secret word.
 */
export function getFeedback(guess: string, secret: string): Pattern {
    const pattern: Feedback[] = new Array(5).fill(0);
    const secretArr = secret.split('');
    const guessArr = guess.split('');

    // First pass: Green
    for (let i = 0; i < 5; i++) {
        if (guessArr[i] === secretArr[i]) {
            pattern[i] = 2;
            secretArr[i] = '#'; // Mark as used
            guessArr[i] = '@';
        }
    }

    // Second pass: Yellow
    for (let i = 0; i < 5; i++) {
        if (guessArr[i] === '@') continue;
        const index = secretArr.indexOf(guessArr[i]);
        if (index !== -1) {
            pattern[i] = 1;
            secretArr[index] = '#';
        }
    }

    return pattern;
}

/**
 * Converts a pattern array to a unique string key or number.
 */
export function patternToId(pattern: Pattern): number {
    return pattern.reduce((acc: number, val, i) => acc + val * Math.pow(3, i), 0);
}

/**
 * Filters the list of solutions based on the feedback from a guess.
 */
export function filterWords(words: string[], guess: string, pattern: Pattern): string[] {
    const patternId = patternToId(pattern);
    return words.filter(word => patternToId(getFeedback(guess, word)) === patternId);
}

/**
 * Calculates the entropy of a word given the remaining possible solutions.
 */
export function calculateEntropy(word: string, remainingSolutions: string[]): number {
    const patternCounts = new Map<number, number>();
    const n = remainingSolutions.length;

    for (const secret of remainingSolutions) {
        const id = patternToId(getFeedback(word, secret));
        patternCounts.set(id, (patternCounts.get(id) || 0) + 1);
    }

    let entropy = 0;
    for (const count of patternCounts.values()) {
        const p = count / n;
        entropy -= p * Math.log2(p);
    }

    return entropy;
}

/**
 * Returns the top N word suggestions based on entropy.
 */
export async function getSuggestions(
    remainingSolutions: string[],
    allGuesses: string[],
    limit: number = 10
): Promise<{ word: string; entropy: number; isPossible: boolean }[]> {
    if (remainingSolutions.length === 0) return [];
    if (remainingSolutions.length === 1) return [{ word: remainingSolutions[0], entropy: 0, isPossible: true }];

    // If too many solutions, entropy calculation is slow. 
    // We can use a subset of allGuesses or just solutions to speed up.
    // However, 2.3k solutions * 13k guesses = 30M comparisons.
    // On the first turn, 'crane' or 'salet' are always top.
    
    // Heuristic: if we have many remaining, only score the most frequent letters.
    // But let's try to be smart.
    
    const scores: { word: string; entropy: number; isPossible: boolean }[] = [];
    
    // To keep it responsive, we might want to only score a subset of allGuesses
    // or prioritize possible solutions.
    const candidates = remainingSolutions.length > 200 
        ? remainingSolutions // Focus on solutions if many left
        : allGuesses;

    for (const word of candidates) {
        const entropy = calculateEntropy(word, remainingSolutions);
        const isPossible = remainingSolutions.includes(word);
        
        // Boost entropy for possible solutions slightly to favor them over equal-entropy guesses
        // and round to 4 decimal places to handle float precision issues
        const roundedEntropy = Math.round(entropy * 10000) / 10000;
        
        scores.push({ 
            word, 
            entropy: roundedEntropy, 
            isPossible 
        });
    }

    // Sort: 1. Higher Entropy, 2. If close entropy, pick possible solutions
    return scores
        .sort((a, b) => {
            if (Math.abs(b.entropy - a.entropy) < 0.0001) {
                if (a.isPossible && !b.isPossible) return -1;
                if (!a.isPossible && b.isPossible) return 1;
            }
            return b.entropy - a.entropy;
        })
        .slice(0, limit);
}
