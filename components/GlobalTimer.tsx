import { ReactNode, useState, useEffect, useRef, ReactElement } from "react";

import moment from "moment";
import { Typography, Card, Box } from "@material-ui/core";

let startTime = 0;
let stopTime = 0;
let handle: number | null = null;

export default function GlobalTimer(): ReactElement {
    const [elapsed, setElapsed] = useState(0);

    const handle = useRef<number | null>(null);

    useEffect(() => {
        setElapsed(stopTime - startTime);
        handle.current = setInterval(() => {
            setElapsed(stopTime - startTime);
        }, 500);

        return () => {
            if (handle.current) {
                clearInterval(handle.current);
                handle.current = null;
            }
        };
    }, []);

    const dur = moment.duration(elapsed, "milliseconds");

    return (
        <Card raised>
            <Box p={1}>
                <Typography variant="h6">
                    {dur.minutes()}:{dur.seconds().toString().padStart(2, "0")}
                </Typography>
            </Box>
        </Card>
    );
}

GlobalTimer.start = () => {
    GlobalTimer.stop();
    startTime = Date.now();

    handle = setInterval(() => {
        stopTime = Date.now();
    }, 500);
};

GlobalTimer.stop = () => {
    if (handle) {
        clearInterval(handle);
        handle = null;
    }

    stopTime = Date.now();
};
