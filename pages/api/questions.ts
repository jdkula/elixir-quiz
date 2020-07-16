import { NextApiHandler } from "next";
import axios from "axios";
import { JSDOM } from "jsdom";
import { parseQuizlet } from "~/lib/quizlet";
import { Question } from "~/lib/quiz";
import { randomized } from "~/lib/util";

let cache: Question[] | null = null;
let cacheTime = 0;

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
    cache = value;
    cacheTime = Date.now();

    return value;
}

async function getQuestions(): Promise<Question[]> {
    if (!cache || Date.now() - cacheTime > 1000 * 60 * 60) {
        return await populateCache();
    }

    return cache;
}

const Questions: NextApiHandler = async (req, res) => {
    const random = (req.query.randomized as string)?.toLowerCase()?.trim()?.includes("true") === true;
    const selectStr = (req.query.select as string)?.toLowerCase()?.trim();
    const selected = (selectStr && Number.parseInt(selectStr)) || null;
    let questions = await getQuestions();

    if (random) questions = randomized(questions);
    if (selected) questions = questions.splice(0, selected);
    res.json(questions);
};

export default Questions;
