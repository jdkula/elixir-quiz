import { NextApiHandler } from "next";

const Up: NextApiHandler = (_, res) => {
    const {
        VERCEL_GITHUB_COMMIT_SHA,
        VERCEL_GITHUB_COMMIT_REF,
        VERCEL_GITHUB_REPO,
        VERCEL_GITHUB_ORG,
        VERCEL_GITHUB_DEPLOYMENT,
        NODE_ENV,
        ENV_MODE,
    } = process.env;

    const version_statement = VERCEL_GITHUB_DEPLOYMENT
        ? `${VERCEL_GITHUB_ORG}/${VERCEL_GITHUB_REPO} ${VERCEL_GITHUB_COMMIT_REF}@${VERCEL_GITHUB_COMMIT_SHA}`
        : "[indev]";

    res.status(200).send(`Elixir Quiz Server, ${version_statement}: ${NODE_ENV} mode | ${ENV_MODE} environment`);
};

export default Up;