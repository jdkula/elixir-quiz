import { ElixirType, ScoredElixirType } from './elixir';
import { Map, Set } from 'immutable';

export type QuestionId = string;

export interface Answer {
    text: string;
    assignment: ScoredElixirType;
}

export interface Question {
    id: QuestionId;
    question: string;
    answers: Answer[];
}

export type AnswerMap = Map<QuestionId, Set<ScoredElixirType>>;
export type Scores = { [k in ScoredElixirType]: number };

export function getScores(answers: AnswerMap): Scores {
    const results: Scores = {
        Aura: 0,
        Elemental: 0,
        Enchantment: 0,
        Transformation: 0,
    };

    for (const choices of answers.values()) {
        for (const choice of choices.values()) {
            results[choice] += 1 / choices.size;
        }
    }

    for (const key of Object.keys(results)) {
        results[key] = (results[key] * 100) / 100; // round to 2 decimal places.
    }

    return results;
}

export function getAssignments(scores: Scores): ElixirType[] {
    const sorted = Object.keys(scores)
        .map((type: ScoredElixirType) => ({ type, score: scores[type] }))
        .sort((a, b) => b.score - a.score);
    const first = sorted[0] ?? { score: 0, type: 'Neutral' };
    const average = sorted.reduce((cur, val) => cur + val.score, 0) / sorted.length;
    const ties = sorted.filter((val) => val.score === first.score).length;
    const aroundAverage = sorted.filter((val) => Math.abs(val.score - average) < 0.5).length;

    if (ties >= 3 || aroundAverage >= 4 || first.type === 'Neutral') {
        return ['Neutral'];
    }

    return sorted.filter((x) => x.score >= first.score).map((x) => x.type);
}
