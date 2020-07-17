import { ReactElement, ReactNode } from "react";
import { Container, Box, GridList } from "@material-ui/core";

export default function QuizContainer({ children }: { children: ReactNode }): ReactElement {
    return (
        <Container>
            <Box my={2}>
                <GridList cols={3} spacing={24} cellHeight="auto">
                    {children}
                </GridList>
            </Box>
        </Container>
    );
}
