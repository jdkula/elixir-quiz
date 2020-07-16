import { ReactElement, useState } from "react";
import useQuestions from "~/lib/useQuestions";
import useElixirs from "~/lib/useElixirs";
import {
    AppBar,
    Toolbar,
    Typography,
    CssBaseline,
    Button,
    Container,
    Box,
    Grid,
    GridList,
    GridListTile,
} from "@material-ui/core";
import QuestionCard from "~/components/QuestionCard";
import { ElixirType } from "~/lib/elixir";
import AnswerOption from "~/components/AnswerOption";
import AppContainer from "~/components/AppContainer";
import QuizContainer from "~/components/QuizContainer";
import Results from "~/components/Results";

import { Map } from "immutable";

export default function Index(): ReactElement {
    const [questions, questionsLoading] = useQuestions(12);

    const [showingResults, setShowingResults] = useState(false);

    const [scores, setScores] = useState(Map<ElixirType, number>());

    const select = (type: ElixirType) => {
        setScores(scores.set(type, (scores.get(type) ?? 0) + 1));
    };

    const deselect = (type: ElixirType) => {
        setScores(scores.set(type, (scores.get(type) ?? 0) - 1));
    };

    return (
        <AppContainer>
            <Typography variant="h5">Elixir Quiz</Typography>
            <QuizContainer>
                {questions.map((q, i) => (
                    <GridListTile key={q.question}>
                        <QuestionCard question={q} index={i}>
                            {q.answers.map((a, j) => (
                                <AnswerOption
                                    key={i + " " + j}
                                    answer={a}
                                    index={j}
                                    select={select}
                                    deselect={deselect}
                                    showing={showingResults}
                                />
                            ))}
                        </QuestionCard>
                    </GridListTile>
                ))}
            </QuizContainer>
            {!showingResults && <Button onClick={() => setShowingResults(true)}>Calculate scores</Button>}
            {showingResults && <Results scores={scores} />}
        </AppContainer>
    );
}
