import { NextApiHandler } from "next";
import mongoresults from "~/lib/mongoresults";

const Results: NextApiHandler = async (req, res) => {
    if (req.method !== "GET") {
        return res.status(405).end();
    }
    const results = await mongoresults;

    res.json(await results.find().sort({ date: -1 }).toArray());
};

export default Results;
