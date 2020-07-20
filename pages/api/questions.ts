import { NextApiHandler } from 'next';
import { randomized } from '~/lib/util';

import { getQuestionsForResult, getQuestions } from '~/lib/cache';

const Questions: NextApiHandler = async (req, res) => {
    const forResult = req.query.forResult as string | undefined;

    const randomizeQuestions =
        (req.query.randomizeQuestions as string)?.toLowerCase()?.trim()?.includes('true') === true;
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
