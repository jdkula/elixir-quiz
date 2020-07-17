import { ReactElement, useState, ChangeEvent } from "react";
import { Switch, Box, FormControlLabel, Slide } from "@material-ui/core";

export default function HideToggle({
    children,
    label,
    shown,
    onToggle,
}: {
    children: ReactElement;
    shown?: boolean;
    onToggle?: (state: boolean) => void;
    label?: string;
}): ReactElement {
    const uncontrolled = shown === undefined || onToggle === undefined;

    const [localShown, setLocalShown] = useState(false);

    const actuallyShown = uncontrolled ? localShown : shown;

    const onClick = (e: ChangeEvent<HTMLInputElement>) => {
        const val = e.target.checked;
        if (uncontrolled) setLocalShown(val);
        else onToggle(val);
    };

    return (
        <Box component="span" display="flex" alignItems="center">
            <Slide direction="down" in={actuallyShown} mountOnEnter unmountOnExit>
                {children}
            </Slide>
            <Box mx={2}>
                <FormControlLabel
                    control={<Switch checked={actuallyShown} onChange={onClick} color="default" />}
                    label={label}
                />
            </Box>
        </Box>
    );
}
