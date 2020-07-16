import { ElixirType } from "./elixir";

export interface Answer {
    text: string;
    assignment: ElixirType;
}

export interface Question {
    question: string;
    answers: Answer[];
}
