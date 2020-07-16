import { ReactElement, ReactNode } from "react";
import { Container, CssBaseline, Box } from "@material-ui/core";

export default function AppContainer({ children }: { children: ReactNode }): ReactElement {
    return (
        <>
            <CssBaseline />
            <Box m={4}>
                <Container>{children}</Container>
            </Box>
        </>
    );
}
