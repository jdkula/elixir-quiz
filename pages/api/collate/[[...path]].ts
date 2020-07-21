import { NextApiHandler } from 'next';
import Axios, { Method } from 'axios';

const kCopiedHeaders = ['cookie', 'referrer', 'user-agent', 'accept', 'accept-encoding', 'accept-language'];

const AnalyticsProxy: NextApiHandler = async (req, res) => {
    if (req.headers.accept?.includes('text/html')) {
        res.status(403).end();
        return;
    }

    const path = req.query.path;
    delete req.query.path;

    req.query.uip =
        req.socket.remoteAddress || req.headers['x-forwarded-for'] || req.connection.remoteAddress || '127.0.0.1';

    const headers: Record<string, string | string[]> = {};
    for (const header of kCopiedHeaders) {
        const copiedHeader = req.headers[header];
        if (copiedHeader) {
            headers[header] = copiedHeader;
        }
    }

    const response = await Axios({
        method: req.method as Method,
        params: req.query,
        headers: headers,
        baseURL: 'https://www.google-analytics.com/' + ((path as string[]) ?? []).join('/').replace('see', 'collect'),
        validateStatus: (status) => status >= 200 && status < 500,
    });

    for (const header of Object.keys(response.headers)) {
        res.setHeader(header, response.headers[header]);
    }

    // don't forward non-200 statuses.
    res.status(response.status).send(response.status >= 200 && response.status < 300 ? response.data : '');
};

export default AnalyticsProxy;
