import { ReactNode, forwardRef } from 'react';
import { Question } from '~/lib/quiz';
import { Card, CardContent, Typography, Box } from '@material-ui/core';

interface Props {
    question: Question;
    index: number;
    children: ReactNode;
}

const QuizCard = forwardRef(({ children }: { children: ReactNode }, ref) => (
    <Box clone height="100%">
        <Card variant="outlined" ref={ref}>
            {children}
        </Card>
    </Box>
));

const QuestionCard = forwardRef(({ question, index, children }: Props, ref) => {
    return (
        <QuizCard ref={ref}>
            <CardContent>
                <Typography variant="h6">Question {index + 1}</Typography>
                <Typography variant="body1">{question.question}</Typography>
                {children}
            </CardContent>
        </QuizCard>
    );
});

export default QuestionCard;
