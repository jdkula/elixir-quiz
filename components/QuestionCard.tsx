import { ReactNode, forwardRef } from 'react';
import { Question } from '~/lib/quiz';
import { Card, CardContent, Typography } from '@material-ui/core';
import styled from 'styled-components';

interface Props {
    question: Question;
    index: number;
    children: ReactNode;
}

const QuizCard = styled(Card)({ height: '100%' });

const QuestionCard = forwardRef(({ question, index, children }: Props, ref) => {
    return (
        <QuizCard ref={ref} variant="outlined">
            <CardContent>
                <Typography variant="h6">Question {index + 1}</Typography>
                <Typography variant="body1">{question.question}</Typography>
                {children}
            </CardContent>
        </QuizCard>
    );
});

QuestionCard.displayName = 'QuestionCard';

export default QuestionCard;
