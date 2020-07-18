import { NextApiHandler } from "next";
import axios from "axios";
import { JSDOM } from "jsdom";
import { parseQuizlet } from "~/lib/quizlet";
import { Question } from "~/lib/quiz";
import { randomized } from "~/lib/util";
import mongoresults from "~/lib/mongoresults";
import { FullResult } from "~/lib/mongostats";

import { ObjectId } from "mongodb";
import mongocache, { MongoCache, kCacheId, kCacheExpiry } from "~/lib/mongocache";
import moment from "moment";

const kProjectInnerQuestion = {
    $project: {
        id: "$questions.id",
        question: "$questions.question",
        answers: "$questions.answers",
        _id: 0,
    },
};

async function populateCache(): Promise<Question[]> {
    const response = await axios.get(process.env.QUIZLET_URL, {
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 5.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36",
        },
    });

    const html = response.data as string;

    const dom = new JSDOM(html);

    const value = [...parseQuizlet(dom.window.document.body).values()];

    const db = await mongocache;

    await db.updateOne(
        { _id: kCacheId },
        {
            $set: {
                questions: value,
                expires: moment().add(kCacheExpiry).toDate(),
            } as MongoCache,
        },
        {
            upsert: true,
        },
    );

    return value;
}

export async function getQuestions(selected?: number): Promise<Question[]> {
    const db = await mongocache;

    let grabPipeline = [];

    if (selected) {
        grabPipeline = [{ $sample: { size: selected } }];
    }

    let questions: Question[] | undefined = await db
        .aggregate([
            {
                $match: {
                    _id: kCacheId,
                    expires: { $gte: new Date() },
                },
            },
            { $unwind: "$questions" },
            ...grabPipeline,
            kProjectInnerQuestion,
        ])
        .toArray();

    if (!questions) {
        console.log("Populating!");
        questions = await populateCache();
    }

    return JSON.parse(JSON.stringify(questions));
}

const Questions: NextApiHandler = async (req, res) => {
    const forResult = req.query.forResult as string | undefined;

    const randomizeQuestions =
        (req.query.randomizeQuestions as string)?.toLowerCase()?.trim()?.includes("true") === true;
    const selectStr = (req.query.select as string)?.toLowerCase()?.trim();
    const selected = (selectStr && Number.parseInt(selectStr)) || null;

    let questions = await getQuestions(selected);

    if (forResult) {
        const results = await mongoresults;
        const result = (await results.findOne({ _id: new ObjectId(forResult) })) as FullResult | null | undefined;
        if (!result) {
            res.status(404).end();
            return;
        }

        const cache = await mongocache;

        const qids = result.answers.map((ar) => ar.question);

        questions = await cache
            .aggregate([
                { $unwind: "$questions" },
                kProjectInnerQuestion,
                {
                    $match: {
                        id: { $in: qids },
                    },
                },
            ])
            .toArray();
    }

    if (randomizeQuestions) questions.forEach((q) => (q.answers = randomized(q.answers)));
    res.json(questions);
};

export default Questions;
