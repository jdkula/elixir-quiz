import { ElixirType } from "./elixir";
import { Map, Set } from "immutable";

export type QuestionId = string;

export interface Answer {
    text: string;
    assignment: ElixirType;
}

export interface Question {
    id: QuestionId;
    question: string;
    answers: Answer[];
}

export type AnswerMap = Map<QuestionId, Set<ElixirType>>;

export function getScores(answers: AnswerMap): Map<ElixirType, number> {
    let results = Map<ElixirType, number>([
        ["Aura", 0],
        ["Elemental", 0],
        ["Enchantment", 0],
        ["Transformation", 0],
    ]);

    for (const choices of answers.values()) {
        for (const choice of choices.values()) {
            results = results.set(choice, results.get(choice) + 1 / choices.size);
        }
    }

    for (const [key, val] of results.entries()) {
        results = results.set(key, Math.floor(val * 100) / 100); // round to 2 decimal places.
    }

    return results;
}

export function getAssignments(scores: Map<ElixirType, number>): ElixirType[] {
    const sorted = scores
        .entrySeq()
        .map(([type, score]) => ({ type, score }))
        .sort((a, b) => b.score - a.score)
        .toList();
    const first = sorted.get(0) ?? { score: 0, type: "Neutral" };
    const average = sorted.reduce((cur, val) => cur + val.score, 0) / sorted.size;
    const ties = sorted.filter((val) => val.score === first.score).size;
    const aroundAverage = sorted.filter((val) => Math.abs(val.score - average) < 0.5).size;

    if (ties >= 3 || aroundAverage >= 4 || first.type === "Neutral") {
        return ["Neutral"];
    }

    return sorted
        .filter((x) => x.score >= first.score)
        .map((x) => x.type)
        .toArray();
}
