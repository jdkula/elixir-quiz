import { ReactElement } from "react";
import { Question, QuestionId, AnswerMap } from "~/lib/quiz";
import QuizContainer from "./QuizContainer";
import { GridListTile } from "@material-ui/core";
import QuestionCard from "./QuestionCard";
import AnswerOption from "./AnswerOption";
import { ElixirType } from "~/lib/elixir";

import { Set } from "immutable";
import DelayedSlide from "./DelayedSlide";

interface Props {
    questions: Question[];
    showingResults: boolean;
    answers: AnswerMap;
    setAnswers: (answers: AnswerMap) => void;
    started: boolean;
    isModal?: boolean;
}

export default function Quiz({
    questions,
    showingResults,
    answers,
    setAnswers,
    started,
    isModal,
}: Props): ReactElement {
    const getSelect = (question: QuestionId) => (type: ElixirType) => {
        setAnswers(answers.set(question, (answers.get(question) ?? Set()).add(type)));
    };

    const getDeselect = (question: QuestionId) => (type: ElixirType) => {
        setAnswers(answers.set(question, (answers.get(question) ?? Set()).delete(type)));
    };

    return (
        <QuizContainer cols={isModal ? 1 : undefined}>
            {started &&
                questions.map((q, i) => (
                    <GridListTile key={q.question}>
                        <DelayedSlide in={started} delay={i * 50} direction="up" mountOnEnter unmountOnExit>
                            <QuestionCard question={q} index={i}>
                                {q.answers.map((a, j) => (
                                    <AnswerOption
                                        key={i + " " + j}
                                        answer={a}
                                        index={j}
                                        select={getSelect(q.id)}
                                        deselect={getDeselect(q.id)}
                                        showing={showingResults}
                                        initialChecked={answers.get(q.id)?.has(a.assignment) ?? undefined}
                                    />
                                ))}
                            </QuestionCard>
                        </DelayedSlide>
                    </GridListTile>
                ))}
        </QuizContainer>
    );
}
