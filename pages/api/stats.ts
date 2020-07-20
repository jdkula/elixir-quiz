import { NextApiHandler } from 'next';
import { getStats, recordStat } from '~/lib/stats.server';

const StatsGET: NextApiHandler = async (req, res) => {
    res.json(await getStats());
};

const StatsPOST: NextApiHandler = async (req, res) => {
    await recordStat(req.body);

    res.status(200).end();
};

const Stats: NextApiHandler = async (req, res) => {
    if (req.method === 'POST') {
        return await StatsPOST(req, res);
    } else if (req.method === 'GET') {
        return await StatsGET(req, res);
    }

    res.status(405).end();
};

export default Stats;
