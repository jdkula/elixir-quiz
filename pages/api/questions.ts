import { NextApiHandler } from "next";
import axios from "axios";
import { JSDOM } from "jsdom";
import { parsePage, Question } from "~/lib/quizlet";

let cache: Question[] | null = null;
let cacheTime: number = 0;

async function populateCache(): Promise<Question[]> {
    const response = await axios.get(process.env.QUIZLET_URL, {
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 5.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36",
        },
    });

    const html = response.data as string;

    const dom = new JSDOM(html);

    const value = [...parsePage(dom.window.document.body).values()];
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
    res.setHeader("Cache-Control", "max-age=3600, public");
    res.json(await getQuestions());
};

export default Questions;
