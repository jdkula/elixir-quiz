import { NextApiHandler } from "next";
import mongoresults from "~/lib/mongoresults";

// Returns the number of unanswered questions
export const numUnansweredQuestionsExpr = {
    $size: {
        $filter: {
            input: {
                $map: {
                    input: "$answers",
                    in: {
                        $size: "$$this.answers",
                    },
                },
            },
            cond: { $eq: ["$$this", 0] },
        },
    },
};

// Returns true if the user spent more than 20 seconds on the quiz and left less than 3 questions unanswered.
export const validResultsFilter = {
    $and: [
        {
            $lt: [numUnansweredQuestionsExpr, 3],
        },
        { $gt: ["$time", 20 * 1000] },
    ],
};

const Results: NextApiHandler = async (req, res) => {
    if (req.method !== "GET") {
        return res.status(405).end();
    }
    const results = await mongoresults;

    res.json(await results.find({ $expr: validResultsFilter }).sort({ date: -1 }).toArray());
};

export default Results;
