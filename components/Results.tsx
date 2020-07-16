import { ReactElement } from "react";
import { ElixirType } from "~/lib/elixir";
import { Box, Typography } from "@material-ui/core";
import useElixirs from "~/lib/useElixirs";

import { Map } from "immutable";

interface Props {
    scores: Map<ElixirType, number>;
}

export default function Results({ scores }: Props): ReactElement {
    const [elixirMap, loading] = useElixirs();

    if (loading) return null;
    const elixirs = [...elixirMap.keys()].sort().map((type) => elixirMap.get(type));

    const sorted = elixirs
        .map((elixir) => ({ type: elixir.type, score: scores.get(elixir.type) ?? 0 }))
        .sort((a, b) => b.score - a.score);

    const particle = elixirMap.get(sorted[0].type).particle;
    const result = sorted
        .filter((x) => x.score >= sorted[0].score)
        .map((out) => (
            <Box component="span" color={elixirMap.get(out.type).color} key={out.type}>
                {out.type}
            </Box>
        ));

    const len = result.length;
    for (let i = 1; i < len; i++) {
        result.splice(
            i * 2 - 1,
            0,
            <Box key={`box-${i}`} component="span">
                {" or "}
            </Box>,
        );
    }

    const breakdown = elixirs.map((elixir) => (
        <Box color={elixir.color} key={elixir.type}>
            {elixir.type}: {scores.get(elixir.type) ?? 0}
        </Box>
    ));

    return (
        <Box>
            <Typography>
                You are {particle} {result}
            </Typography>
            {breakdown}
        </Box>
    );
}
