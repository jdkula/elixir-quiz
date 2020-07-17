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
    width,
}: {
    children: ReactNode;
    left?: ReactNode;
    width?: Breakpoint;
}): ReactElement {
    const trigger = useScrollTrigger();

    const canTrigger = isWidthDown("md", width, true);

    return (
        <>
            <Slide in={!(canTrigger && trigger)}>
                <AppBar position="sticky">
                    <Toolbar>
                        <Box flexGrow={1} ml={2}>
                            <Typography variant="h4">Elixir Quiz</Typography>
                        </Box>
                        {left}
                    </Toolbar>
                </AppBar>
            </Slide>
            <Box m={4}>
                <Container>{children}</Container>
            </Box>
        </>
    );
}

export default withWidth()(AppContainer);
