import { ReactElement } from "react";
import { Question } from "~/lib/quiz";
import QuizContainer from "./QuizContainer";
import { GridListTile } from "@material-ui/core";
import QuestionCard from "./QuestionCard";
import AnswerOption from "./AnswerOption";
import { AnswerMap } from "~/pages";
import { ElixirType } from "~/lib/elixir";

import { Set } from "immutable";
import DelayedSlide from "./DelayedSlide";

interface Props {
    questions: Question[];
    showingResults: boolean;
    answers: AnswerMap;
    setAnswers: (answers: AnswerMap) => void;
    started: boolean;
}

export default function Quiz({ questions, showingResults, answers, setAnswers, started }: Props): ReactElement {
    const getSelect = (questionIndex: number) => (type: ElixirType) => {
        setAnswers(answers.set(questionIndex, (answers.get(questionIndex) ?? Set()).add(type)));
    };

    const getDeselect = (questionIndex: number) => (type: ElixirType) => {
        setAnswers(answers.set(questionIndex, (answers.get(questionIndex) ?? Set()).delete(type)));
    };

    return (
        <QuizContainer>
            {questions.map((q, i) => (
                <GridListTile key={q.question}>
                    <DelayedSlide in={started} delay={i * 50} direction="up" mountOnEnter unmountOnExit>
                        <QuestionCard question={q} index={i}>
                            {q.answers.map((a, j) => (
                                <AnswerOption
                                    key={i + " " + j}
                                    answer={a}
                                    index={j}
                                    select={getSelect(i)}
                                    deselect={getDeselect(i)}
                                    showing={showingResults}
                                />
                            ))}
                        </QuestionCard>
                    </DelayedSlide>
                </GridListTile>
            ))}
        </QuizContainer>
    );
}
