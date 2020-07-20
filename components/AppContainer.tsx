import { ReactElement, ReactNode } from 'react';
import {
    Container,
    Box,
    AppBar,
    Toolbar,
    Typography,
    useScrollTrigger,
    Slide,
    withWidth,
    isWidthDown,
    makeStyles,
} from '@material-ui/core';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';

const useStyles = makeStyles({
    noSelect: {
        userSelect: 'none',
    },
});

function AppContainer({
    children,
    right,
    below,
    width,
    pinned,
}: {
    children: ReactNode;
    right?: ReactNode;
    below?: ReactNode;
    width?: Breakpoint;
    pinned?: boolean;
}): ReactElement {
    const styles = useStyles();
    const trigger = useScrollTrigger();

    const canTrigger = isWidthDown('md', width, true);

    return (
        <>
            <Slide in={!(canTrigger && trigger) || pinned} appear={false}>
                <AppBar position="sticky">
                    <Toolbar className={styles.noSelect}>
                        <Box flexGrow={1} ml={2}>
                            <Typography variant="h4">Elixir Quiz</Typography>
                        </Box>
                        {right}
                    </Toolbar>
                    {below}
                </AppBar>
            </Slide>
            <Box m={4}>
                <Container>{children}</Container>
            </Box>
        </>
    );
}

export default withWidth()(AppContainer);
