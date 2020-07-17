import { ReactElement, useState } from "react";
import useQuestions from "~/lib/useQuestions";
import { Button, Box } from "@material-ui/core";
import { ElixirType } from "~/lib/elixir";
import AppContainer from "~/components/AppContainer";
import Results from "~/components/Results";

import { Map, Set } from "immutable";
import Head from "next/head";
import GlobalTimer from "~/components/GlobalTimer";
import HideToggle from "~/components/HideToggle";
import Quiz from "~/components/Quiz";

export type AnswerMap = Map<number, Set<ElixirType>>;

export default function Index(): ReactElement {
    const [questions, questionsLoading] = useQuestions(12);

    const [showingResults, setShowingResults] = useState(false);

    const [answers, setAnswers] = useState<AnswerMap>(Map());

    const [started, setStarted] = useState(false);

    const start = () => {
        setStarted(true);
        GlobalTimer.start();
    };

    const stop = () => {
        setShowingResults(true);
        GlobalTimer.stop();
    };

    return (
        <AppContainer
            left={
                <HideToggle>
                    <GlobalTimer />
                </HideToggle>
            }
        >
            <Head>
                <title>Elixir Quiz</title>
            </Head>
            <Box clone width="10rem">
                <Button
                    onClick={start}
                    disabled={questionsLoading || started}
                    variant="outlined"
                    color="secondary"
                    size="large"
                >
                    {(questionsLoading && "Loading...") || (started && "Go!") || "Start!"}
                </Button>
            </Box>
            {started && (
                <Quiz questions={questions} showingResults={showingResults} answers={answers} setAnswers={setAnswers} />
            )}

            {started && (
                <Box width="15rem">
                    <Button variant="outlined" color="secondary" size="large" disabled={showingResults} onClick={stop}>
                        {showingResults ? "Finished!" : "Calculate scores"}
                    </Button>
                </Box>
            )}
            {showingResults && <Results answers={answers} />}
        </AppContainer>
    );
}
