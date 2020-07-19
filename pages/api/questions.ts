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

async function populateCache() {
    const db = await mongocache;

    try {
        const response = await axios.get(process.env.QUIZLET_URL, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 5.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36",
            },
        });

        const html = response.data as string;

        const dom = new JSDOM(html);

        const value = [...parseQuizlet(dom.window.document.body).values()];

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
    } catch (e) {
        // if we can't fetch for whatever reason, bump the expiry and try again later.
        await db.updateOne({ _id: kCacheId }, { $set: { expires: moment().add(kCacheExpiry).toDate() } });
    }
}

async function getCachedQuestions(selected?: number): Promise<Question[] | null> {
    const db = await mongocache;
    let grabPipeline = [];

    if (selected) {
        grabPipeline = [{ $sample: { size: selected } }];
    }

    const questions: Question[] = await db
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

    return questions.length === 0 ? null : questions;
}

async function getQuestionsForResult(resultId: string): Promise<Question[] | null> {
    const results = await mongoresults;
    const result = (await results.findOne({ _id: new ObjectId(resultId) })) as FullResult | null | undefined;
    if (!result) {
        return null;
    }

    const cache = await mongocache;

    const qids = result.answers.map((ar) => ar.question);

    const questions = await cache
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

    return questions.length === 0 ? null : questions;
}

export async function getQuestions(selected?: number): Promise<Question[] | null> {
    let questions = await getCachedQuestions(selected);

    if (!questions) {
        console.log("Populating!");
        await populateCache();
        questions = await getCachedQuestions(selected);
    }

    return JSON.parse(JSON.stringify(questions));
}

const Questions: NextApiHandler = async (req, res) => {
    const forResult = req.query.forResult as string | undefined;

    const randomizeQuestions =
        (req.query.randomizeQuestions as string)?.toLowerCase()?.trim()?.includes("true") === true;
    const selectStr = (req.query.select as string)?.toLowerCase()?.trim();
    const selected = (selectStr && Number.parseInt(selectStr)) || null;

    const questions = forResult ? await getQuestionsForResult(forResult) : await getQuestions(selected);

    if (!questions) {
        res.status(500).end("Couldn't fetch questions...");
        return;
    }

    if (randomizeQuestions) questions.forEach((q) => (q.answers = randomized(q.answers)));
    res.json(questions);
};

export default Questions;
