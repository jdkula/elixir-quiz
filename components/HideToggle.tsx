import { ReactNode, ReactElement, useState } from "react";
import { Switch, Box, FormControlLabel } from "@material-ui/core";

export default function HideToggle({ children, label }: { children: ReactNode; label?: string }): ReactElement {
    const [shown, setShown] = useState(false);

    return (
        <Box component="span" display="flex" alignItems="center">
            {shown && children}
            <Box mx={2}>
                <FormControlLabel
                    control={<Switch checked={shown} onChange={(e) => setShown(e.target.checked)} color="default" />}
                    label={label}
                />
            </Box>
        </Box>
    );
}
