import { ReactElement, useState } from 'react';
import useQuestions from '~/lib/useQuestions';
import { Button, Box } from '@material-ui/core';
import AppView from '~/components/AppView';
import Results from '~/components/Results';

import { Map, Set } from 'immutable';
import Head from 'next/head';
import GlobalTimer from '~/components/GlobalTimer';
import HideToggle from '~/components/HideToggle';
import Quiz from '~/components/Quiz';
import { AnswerMap } from '~/lib/quiz';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { sendStat } from '~/lib/stats';
import LoadingIndicator from '~/components/LoadingIndicator';
import styled from 'styled-components';

const Centered = styled(Box)({
    width: '100%',
    textAlign: 'center',
});

const WideButton = styled(Button)<{ $minWidth?: string }>`
    min-width: ${({ $minWidth }) => $minWidth || '10rem'};
`;

export default function Index(): ReactElement {
    const [questions, questionsLoading, error, refresh] = useQuestions(12);
    const [showingResults, setShowingResults] = useState(false);
    const [answers, setAnswers] = useState<AnswerMap>(Map());
    const [started, setStarted] = useState(false);
    const [timerShown, setTimerShown] = useState(false);
    const router = useRouter();

    const start = () => {
        setStarted(!started);
        setAnswers(Map(questions.map((q) => [q.id, Set()]))); // initialize with all questions
        GlobalTimer.start();
    };

    const restart = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });

        setShowingResults(false);
        setAnswers(Map());
        setStarted(false);
        GlobalTimer.start();
        GlobalTimer.stop();
        refresh();
    };

    const stop = () => {
        setShowingResults(true);
        GlobalTimer.stop();
        requestAnimationFrame(() => {
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth',
            });
        });

        sendStat(answers);
    };

    return (
        <AppView
            pinned={timerShown || showingResults}
            right={
                <HideToggle shown={timerShown} onToggle={setTimerShown}>
                    <GlobalTimer />
                </HideToggle>
            }
            below={<LoadingIndicator loading={questionsLoading} error={error} />}
        >
            <Head>
                <title>Elixir Quiz</title>
            </Head>
            <Centered position="relative">
                {!showingResults ? (
                    <WideButton
                        onClick={start}
                        disabled={questionsLoading || started || error}
                        variant="outlined"
                        color="secondary"
                        size="large"
                    >
                        {(questionsLoading && 'Loading...') ||
                            (error && 'Error loading questions!') ||
                            (started && 'Go!') ||
                            'Start!'}
                    </WideButton>
                ) : (
                    <WideButton onClick={restart} variant="outlined" color="primary" size="large">
                        Restart
                    </WideButton>
                )}
            </Centered>
            <Quiz
                questions={questions}
                showingResults={showingResults}
                answers={answers}
                setAnswers={setAnswers}
                started={started}
            />
            <Centered>
                {started && (
                    <WideButton
                        variant="outlined"
                        color="default"
                        size="large"
                        disabled={showingResults}
                        onClick={stop}
                    >
                        {showingResults ? 'Finished!' : 'Finish!'}
                    </WideButton>
                )}
                {showingResults && (
                    <>
                        <Results answers={answers} />
                        <WideButton variant="outlined" color="primary" onClick={restart}>
                            Restart
                        </WideButton>
                    </>
                )}
                <Box my={2} />
                {(!started || showingResults) && (
                    <Link href="/stats">
                        <WideButton
                            $minWidth="8rem"
                            variant="outlined"
                            color="default"
                            onClick={() => router.push('/stats')}
                        >
                            View Stats
                        </WideButton>
                    </Link>
                )}
            </Centered>
        </AppView>
    );
}
