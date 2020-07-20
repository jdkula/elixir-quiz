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
} from '@material-ui/core';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import Link from 'next/link';
import { useRouter } from 'next/router';

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

    const router = useRouter();

    return (
        <>
            <Slide in={!(canTrigger && trigger) || pinned} appear={false}>
                <AppBar position="sticky">
                    <Toolbar className={classes.noSelect}>
                        <Link href="/">
                            <Box flexGrow={1} ml={2} className={classes.clickable} onClick={() => router.push('/')}>
                                <Typography variant="h4">Elixir Quiz</Typography>
                            </Box>
                        </Link>
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
