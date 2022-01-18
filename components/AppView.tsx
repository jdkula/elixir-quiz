import { ReactNode, FC } from 'react';
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
    Link,
} from '@material-ui/core';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import NextLink from 'next/link';

const useStyles = makeStyles({
    noSelect: {
        userSelect: 'none',
    },
    clickable: {
        cursor: 'pointer',
    },
});

interface AppViewProps {
    children: ReactNode;
    right?: ReactNode;
    below?: ReactNode;
    width?: Breakpoint;
    pinned?: boolean;
}

const AppView: FC<AppViewProps> = ({ children, right, below, width, pinned }) => {
    const classes = useStyles();
    const trigger = useScrollTrigger();

    const canTrigger = isWidthDown('md', width, true);

    return (
        <>
            <Slide in={!(canTrigger && trigger) || pinned} appear={false}>
                <AppBar position="sticky">
                    <Toolbar className={classes.noSelect}>
                        <NextLink passHref href="/">
                            <Box flexGrow={1} ml={2} className={classes.clickable} color="white">
                                <Link color="inherit">
                                    <Typography variant="h4">Elixir Quiz</Typography>
                                </Link>
                            </Box>
                        </NextLink>
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
};

export default withWidth()(AppView);
