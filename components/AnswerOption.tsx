import { ReactElement, useState, ChangeEvent } from "react";
import { Answer } from "~/lib/quiz";
import { Typography, FormControlLabel, Checkbox, Box } from "@material-ui/core";
import { ElixirType, getElixir } from "~/lib/elixir";

interface Props {
    answer: Answer;
    index: number;
    showing?: boolean;
    initialChecked?: boolean;

    select: (type: ElixirType) => void;
    deselect: (type: ElixirType) => void;
}

export default function AnswerOption({ answer, index, showing, select, deselect, initialChecked }: Props): ReactElement {
    const [checked, setChecked] = useState(initialChecked ?? false);

    const update = (e: ChangeEvent<HTMLInputElement>) => {
        const nowChecked = e.target.checked;
        setChecked(nowChecked);

        if (nowChecked) select(answer.assignment);
        else deselect(answer.assignment);
    };

    const letterIndex = "abcdefghijklmnopqrstuvwxyz"[index];

    const color = getElixir(answer.assignment).color;

    const style = !showing ? undefined : { color };

    return (
        <div>
            <FormControlLabel
                control={
                    <Box color="primary">
                        <Checkbox
                            checked={checked}
                            onChange={update}
                            color="primary"
                            style={style}
                            disabled={showing}
                        />
                    </Box>
                }
                label={
                    <Box color={(showing && color) || undefined}>
                        <Typography variant="body2">
                            {letterIndex}) {answer.text}
                        </Typography>
                    </Box>
                }
            />
        </div>
    );
}
