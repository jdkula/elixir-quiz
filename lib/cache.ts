import mongocache from './db/mongocache';
import Axios from 'axios';
import { JSDOM } from 'jsdom';
import { parseQuizlet } from './quizlet';
import { kCacheId, kCacheExpiry, MongoCache } from './db';
import { Question } from './quiz';
import moment from 'moment';
import mongoresults from './db/mongoresults';
import { ObjectId } from 'mongodb';
import { FullResult } from './stats.server';

const kProjectInnerQuestion = {
    $project: {
        id: '$questions.id',
        question: '$questions.question',
        answers: '$questions.answers',
        _id: 0,
    },
};

async function populateCache() {
    const db = await mongocache;

    try {
        const response = await Axios.get(process.env.QUIZLET_URL, {
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 5.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36',
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
            { $unwind: '$questions' },
            ...grabPipeline,
            kProjectInnerQuestion,
        ])
        .toArray();

    return questions.length === 0 ? null : questions;
}

export async function getQuestionsForResult(resultId: string): Promise<Question[] | null> {
    const results = await mongoresults;
    const result = (await results.findOne({ _id: new ObjectId(resultId) })) as FullResult | null | undefined;
    if (!result) {
        return null;
    }

    const cache = await mongocache;

    const qids = result.answers.map((ar) => ar.question);

    const questions = await cache
        .aggregate([
            { $unwind: '$questions' },
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
        console.log('Populating!');
        await populateCache();
        questions = await getCachedQuestions(selected);
    }

    return JSON.parse(JSON.stringify(questions));
}
