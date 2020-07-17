import { ReactElement } from "react";
import { ElixirType, getElixir, getElixirTypes } from "~/lib/elixir";
import { Box, Typography } from "@material-ui/core";

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
            <Typography>
                You are elixir-
                <Box component="span" color={neutral.color}>
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
            <Box component="span" color={getElixir(out.type).color} key={out.type}>
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
        <Typography>
            You are {particle} {result} user!
        </Typography>
    );
}

export default function Results({ answers }: Props): ReactElement {
    const scores = getScores(answers);
    const breakdown = getElixirTypes().map((elixir) => (
        <Box color={elixir.color} key={elixir.type}>
            {elixir.type}: {scores.get(elixir.type) ?? 0}
        </Box>
    ));

    return (
        <Box>
            <Assignment scores={scores} />
            {breakdown}
        </Box>
    );
}
