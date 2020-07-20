import { ReactElement, ReactNode } from 'react';
import { Container, Box, GridList, withWidth, isWidthUp } from '@material-ui/core';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';

function QuizContainer({
    children,
    width,
    cols,
}: {
    children: ReactNode;
    width?: Breakpoint;
    cols?: number;
}): ReactElement {
    const gridCols = cols || (isWidthUp('md', width, true) ? 3 : 1);

    return (
        <Container>
            <Box my={2}>
                <GridList cols={gridCols} spacing={24} cellHeight="auto">
                    {children}
                </GridList>
            </Box>
        </Container>
    );
}

export default withWidth()(QuizContainer);
