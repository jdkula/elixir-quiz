import mongodb from "./mongodb";
import { QuestionId } from "./quiz";
import { ElixirType } from "./elixir";

export interface AnswerResult {
    question: QuestionId;
    answers: ElixirType[];
}

export interface StatsReqBody {
    answers: AnswerResult[];
    time: number;
    date: Date;
}

export interface FullResult extends StatsReqBody {
    scores: Omit<{ [Type in ElixirType]: number }, "Neutral">;
    result: ElixirType[];
}

const mongostats = mongodb.then((db) => db.collection("stats"));

export default mongostats;
