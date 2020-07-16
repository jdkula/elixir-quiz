import { NextApiHandler } from "next";
import axios from "axios";
import { JSDOM } from "jsdom";
import { parsePage } from "~/lib/quizlet";

const Questions: NextApiHandler = async (req, res) => {
    const response = await axios.get(process.env.QUIZLET_URL, {
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 5.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36",
        },
    });

    const html = response.data as string;

    const dom = new JSDOM(html);

    res.json([...parsePage(dom.window.document.body).values()]);
};

export default Questions;
