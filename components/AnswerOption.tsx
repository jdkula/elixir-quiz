import { ReactElement, useState, useEffect, ChangeEvent } from "react";
import { Answer } from "~/lib/quiz";
import { Typography, FormControlLabel, Checkbox, Box } from "@material-ui/core";
import useElixirs from "~/lib/useElixirs";
import { ElixirType } from "~/lib/elixir";

interface Props {
    answer: Answer;
    index: number;
    showing?: boolean;

    select(type: ElixirType): void;
    deselect(type: ElixirType): void;
}

export default function AnswerOption({ answer, index, showing, select, deselect }: Props): ReactElement {
    const [elixirs] = useElixirs();
    const [checked, setChecked] = useState(false);

    const update = (e: ChangeEvent<HTMLInputElement>) => {
        const nowChecked = e.target.checked;
        setChecked(nowChecked);

        if (nowChecked) select(answer.assignment);
        else deselect(answer.assignment);
    };

    const letterIndex = "abcdefghijklmnopqrstuvwxyz"[index];
    return (
        <div>
            <FormControlLabel
                control={<Checkbox color="primary" checked={checked} onChange={update} />}
                label={
                    <Box color={(showing && elixirs.get(answer.assignment).color) || undefined}>
                        <Typography variant="body2">
                            {letterIndex}) {answer.text}
                        </Typography>
                    </Box>
                }
            />
        </div>
    );
}
