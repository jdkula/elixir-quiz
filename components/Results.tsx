import { ReactElement } from "react";
import { ElixirType, getElixir, getElixirTypes } from "~/lib/elixir";
import { Box, Typography, Grid } from "@material-ui/core";

import { Map } from "immutable";
import { AnswerMap } from "~/pages";

interface Props {
    answers: AnswerMap;
}

function getScores(answers: AnswerMap): Map<ElixirType, number> {
    let results = Map<ElixirType, number>([
        ["Aura", 0],
        ["Elemental", 0],
        ["Enchanter", 0],
        ["Transformer", 0],
    ]);

    for (const choices of answers.values()) {
        for (const choice of choices.values()) {
            results = results.set(choice, results.get(choice) + 1 / choices.size);
        }
    }

    for (const [key, val] of results.entries()) {
        results = results.set(key, Math.floor(val * 100) / 100); // round to 2 decimal places.
    }

    return results;
}

function Assignment({ scores }: { scores: Map<ElixirType, number> }): ReactElement {
    const sorted = scores
        .entrySeq()
        .map(([type, score]) => ({ type, score }))
        .sort((a, b) => b.score - a.score)
        .toList();
    const first = sorted.get(0);
    const average = sorted.reduce((cur, val) => cur + val.score, 0) / sorted.size;
    const ties = sorted.filter((val) => val.score === first.score).size;
    const aroundAverage = sorted.filter((val) => Math.abs(val.score - average) < 0.5).size;

    if (ties >= 3 || aroundAverage >= 4) {
        const neutral = getElixir("Neutral");
        return (
            <Typography variant="h4">
                You are elixir-
                <Box component="span" color={neutral.color} fontWeight="bold">
                    neutral
                </Box>
                !
            </Typography>
        );
    }

    const particle = getElixir(first.type).particle;

    const winners = sorted.filter((x) => x.score >= first.score);
    const result = winners.map((out, i) => (
        <>
            <Box component="span" color={getElixir(out.type).color} key={out.type} fontWeight="bold">
                {out.type}
            </Box>
            {i < winners.size - 1 && (
                <Box key={`box-${i}`} component="span">
                    {" or "}
                </Box>
            )}
        </>
    ));

    return (
        <Typography variant="h4">
            You are {particle} {result} elixir user!
        </Typography>
    );
}

function Breakdown({ scores }: { scores: Map<ElixirType, number> }): ReactElement {
    const breakdown = getElixirTypes().map((elixir) => (
        <>
            <Grid item xs={5} key={elixir.type + 1}>
                <Box color={elixir.color} textAlign="right">
                    {elixir.type}
                </Box>
            </Grid>
            <Grid item xs={2} key={elixir.type + 2}>
                <Box color={elixir.color} textAlign="center">
                    —
                </Box>
            </Grid>
            <Grid item xs={5} key={elixir.type + 3}>
                <Box color={elixir.color} textAlign="left">
                    {scores.get(elixir.type) ?? 0}
                </Box>
            </Grid>
        </>
    ));

    return (
        <Grid container direction="row" justify="center">
            <Box width="auto">
                <Grid container spacing={0}>
                    {breakdown}
                </Grid>
            </Box>
        </Grid>
    );
}

export default function Results({ answers }: Props): ReactElement {
    const scores = getScores(answers);

    return (
        <Box mt={3}>
            <Box width="100%" textAlign="center">
                <Assignment scores={scores} />
            </Box>
            <Box m={2}>
                <Breakdown scores={scores} />
            </Box>
        </Box>
    );
}
