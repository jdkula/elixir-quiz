import { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import { CssBaseline, ThemeProvider as MuiThemeProvider, createMuiTheme, StylesProvider } from '@material-ui/core';
import { ThemeProvider } from 'styled-components';
import { initGA, logPageView } from '~/lib/googleAnalytics';
import { amber, cyan } from '@material-ui/core/colors';
import { AppPropsType } from 'next/dist/shared/lib/utils';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: cyan[400],
        },
        secondary: {
            main: amber.A400,
        },
    },
});

export default function App({ Component, pageProps }: AppPropsType): ReactElement {
    useEffect(() => {
        initGA();
        logPageView();
    }, [Component]);
    return (
        <StylesProvider injectFirst>
            <MuiThemeProvider theme={theme}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <Head>
                        <meta name="theme-color" content="#4fd2d6" />
                        <meta name="msapplication-navbutton-color" content="#4fd2d6" />
                        <meta name="apple-mobile-web-app-status-bar-style" content="#4fd2d6" />
                        <meta name="viewport" content="width=device-width, initial-scale=1" />
                        <link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png" />
                        <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png" />
                        <link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png" />
                        <link rel="manifest" href="site.webmanifest" />
                    </Head>

                    <Component {...pageProps} />
                </ThemeProvider>
            </MuiThemeProvider>
        </StylesProvider>
    );
}
