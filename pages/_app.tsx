import { AppPropsType } from 'next/dist/next-server/lib/utils';
import { ReactElement } from 'react';
import Head from 'next/head';
import { CssBaseline, ThemeProvider, createMuiTheme } from '@material-ui/core';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#4fd2d6',
        },
    },
});

export default function App({ Component, pageProps }: AppPropsType): ReactElement {
    return (
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
    );
}
