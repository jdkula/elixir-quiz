import { ReactElement, ReactNode } from "react";
import { Question } from "~/lib/quiz";
import { Card, CardContent, Typography, Box, GridListTile } from "@material-ui/core";

interface Props {
    question: Question;
    index: number;
    children: ReactNode;
}

const QuizCard = ({ children }: { children: ReactNode }) => (
    <Box clone height="100%">
        <Card variant="outlined"> {children} </Card>
    </Box>
);

export default function QuestionCard({ question, index, children }: Props): ReactElement {
    return (
        <QuizCard>
            <CardContent>
                <Typography variant="h6">Question {index}</Typography>
                <Typography variant="body1">{question.question}</Typography>
                {children}
            </CardContent>
        </QuizCard>
    );
}
