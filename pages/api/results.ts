import { NextApiHandler } from 'next';
import { getResults } from '~/lib/stats.server';

const Results: NextApiHandler = async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).end();
    }

    res.json(await getResults());
};

export default Results;
