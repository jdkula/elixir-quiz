import { ReactElement, FC } from 'react';
import useStats from '~/lib/useStats';
import AppView from '~/components/AppView';
import { Button, Collapse, LinearProgress, Box, Container, Typography } from '@material-ui/core';

import Link from 'next/link';
import { useRouter } from 'next/router';
import useResults from '~/lib/useResults';
import Head from 'next/head';

import StatsResults from '~/components/StatsResults';
import StatsSummary from '~/components/StatsSummary';
import { FullResult } from '~/lib/stats';

const Results: FC<{ results: FullResult[] }> = ({ results }) => (
    <Container>
        <Typography>Here are the latest results! </Typography>
        <Box m={2} display="flex" flexDirection="column" width="min-content" alignItems="center">
            {results.map((res, i) => (
                <Box component="div" m={1} key={i}>
                    <StatsResults result={res} />
                </Box>
            ))}
        </Box>
    </Container>
);

export default function StatsPage(): ReactElement {
    const [stats, statsLoading] = useStats();
    const [results, resultsLoading] = useResults();
    const router = useRouter();

    return (
        <AppView
            below={
                <Collapse in={statsLoading || resultsLoading}>
                    <LinearProgress />
                </Collapse>
            }
            right={
                <Link href="/">
                    <Button onClick={() => router.push('/')}>Return to Quiz</Button>
                </Link>
            }
        >
            <Head>
                <title>Elixir Quiz Stats</title>
            </Head>
            {!statsLoading && <StatsSummary stats={stats} />}
            {!resultsLoading && <Results results={results} />}
        </AppView>
    );
}
