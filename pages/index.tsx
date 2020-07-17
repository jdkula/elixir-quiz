import { ReactElement, useState } from "react";
import useQuestions from "~/lib/useQuestions";
import { Button, Box, ButtonProps, LinearProgress, Collapse } from "@material-ui/core";
import { ElixirType } from "~/lib/elixir";
import AppContainer from "~/components/AppContainer";
import Results from "~/components/Results";

import { Map, Set } from "immutable";
import Head from "next/head";
import GlobalTimer from "~/components/GlobalTimer";
import HideToggle from "~/components/HideToggle";
import Quiz from "~/components/Quiz";

export type AnswerMap = Map<number, Set<ElixirType>>;

const CenterButton = (props: ButtonProps) => (
    <Box textAlign="center" width="100%">
        <Box clone width="10rem">
            <Button {...props} />
        </Box>
    </Box>
);

export default function Index(): ReactElement {
    const [questions, questionsLoading, refresh] = useQuestions(12);

    const [showingResults, setShowingResults] = useState(false);

    const [answers, setAnswers] = useState<AnswerMap>(Map());

    const [started, setStarted] = useState(false);

    const start = () => {
        setStarted(!started);
        GlobalTimer.start();
    };

    const restart = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
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
                behavior: "smooth",
            });
        });
    };

    return (
        <AppContainer
            left={
                <HideToggle>
                    <GlobalTimer />
                </HideToggle>
            }
            below={
                <Collapse in={questionsLoading}>
                    <LinearProgress />
                </Collapse>
            }
        >
            <Head>
                <title>Elixir Quiz</title>
            </Head>
            <Box position="relative">
                {!showingResults ? (
                    <CenterButton
                        onClick={start}
                        disabled={questionsLoading || started}
                        variant="outlined"
                        color="secondary"
                        size="large"
                    >
                        {(questionsLoading && "Loading...") || (started && "Go!") || "Start!"}
                    </CenterButton>
                ) : (
                    <CenterButton onClick={restart} variant="outlined" color="primary" size="large">
                        Restart
                    </CenterButton>
                )}
            </Box>

            <Quiz
                questions={questions}
                showingResults={showingResults}
                answers={answers}
                setAnswers={setAnswers}
                started={started}
            />
            {started && (
                <CenterButton variant="outlined" color="default" size="large" disabled={showingResults} onClick={stop}>
                    {showingResults ? "Finished!" : "Finish!"}
                </CenterButton>
            )}
            {showingResults && <Results answers={answers} />}
            {showingResults && (
                <CenterButton variant="outlined" color="primary" onClick={restart}>
                    Restart
                </CenterButton>
            )}
        </AppContainer>
    );
}
