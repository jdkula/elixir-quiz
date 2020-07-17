import { ReactNode, ReactElement, useState } from "react";
import { Switch, Box, FormControlLabel, Slide } from "@material-ui/core";

export default function HideToggle({ children, label }: { children: ReactElement; label?: string }): ReactElement {
    const [shown, setShown] = useState(false);

    return (
        <Box component="span" display="flex" alignItems="center">
            <Slide direction="down" in={shown} mountOnEnter unmountOnExit>
                {children}
            </Slide>
            <Box mx={2}>
                <FormControlLabel
                    control={<Switch checked={shown} onChange={(e) => setShown(e.target.checked)} color="default" />}
                    label={label}
                />
            </Box>
        </Box>
    );
}
