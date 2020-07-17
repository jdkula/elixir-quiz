import { ReactElement, ReactNode } from "react";
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
} from "@material-ui/core";
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";

function AppContainer({
    children,
    left,
    below,
    width,
    pinned,
}: {
    children: ReactNode;
    left?: ReactNode;
    below?: ReactNode;
    width?: Breakpoint;
    pinned?: boolean;
}): ReactElement {
    const trigger = useScrollTrigger();

    const canTrigger = isWidthDown("md", width, true);

    return (
        <>
            <Slide in={!(canTrigger && trigger) || pinned} appear={false}>
                <AppBar position="sticky">
                    <Toolbar>
                        <Box flexGrow={1} ml={2}>
                            <Typography variant="h4">Elixir Quiz</Typography>
                        </Box>
                        {left}
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
