import { ReactElement, ReactNode } from "react";
import {
    Container,
    CssBaseline,
    Box,
    AppBar,
    Toolbar,
    Typography,
    ThemeProvider,
    createMuiTheme,
} from "@material-ui/core";
import Head from "next/head";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#4fd2d6",
        },
    },
});

export default function AppContainer({ children, left }: { children: ReactNode; left?: ReactNode }): ReactElement {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Head>
                <meta name="theme-color" content="#4fd2d6" />
                <meta name="msapplication-navbutton-color" content="#4fd2d6" />
                <meta name="apple-mobile-web-app-status-bar-style" content="#4fd2d6" />
                <link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png" />
                <link rel="manifest" href="site.webmanifest" />
            </Head>
            <AppBar position="sticky">
                <Toolbar>
                    <Box flexGrow={1} ml={2}>
                        <Typography variant="h4">Elixir Quiz</Typography>
                    </Box>
                    {left}
                </Toolbar>
            </AppBar>
            <Box m={4}>
                <Container>{children}</Container>
            </Box>
        </ThemeProvider>
    );
}
