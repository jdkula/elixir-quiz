import { ReactElement, Fragment } from "react";
import { ElixirType, getElixir, getElixirTypes } from "~/lib/elixir";
import { Box, Typography, Grid } from "@material-ui/core";

import { Map } from "immutable";
import { AnswerMap, getScores, getAssignments } from "~/lib/quiz";

interface Props {
    answers: AnswerMap;
}

function Assignment({ scores }: { scores: Map<ElixirType, number> }): ReactElement {
    const winners = getAssignments(scores);

    if (winners.length === 1 && winners[0] === "Neutral") {
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

    const particle = getElixir(winners[0]).particle;
    const result = winners.map((out, i) => (
        <Fragment key={out}>
            <Box component="span" color={getElixir(out).color} fontWeight="bold">
                {out}
            </Box>
            {i < winners.length - 1 && <Box component="span"> or </Box>}
        </Fragment>
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
