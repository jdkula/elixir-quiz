import { NextApiHandler } from "next";
import axios from "axios";
import { JSDOM } from "jsdom";
import { parsePage } from "~/lib/quizlet";

const Questions: NextApiHandler = async (req, res) => {
    const response = await axios.get(process.env.QUIZLET_URL, {});

    const html = response.data as string;

    const dom = new JSDOM(html);

    res.json(parsePage(dom.window.document.body));
};

export default Questions;
