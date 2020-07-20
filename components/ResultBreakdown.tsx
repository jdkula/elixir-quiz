import { FC, Fragment } from 'react';
import ElixirText from './ElixirText';
import { getElixirTypes } from '~/lib/elixir';
import { Grid, Box } from '@material-ui/core';
import { Scores } from '~/lib/quiz';

interface Props {
    scores: Scores;
}

const ResultBreakdown: FC<Props> = ({ scores }) => {
    const breakdown = getElixirTypes().map((elixir) => (
        <Fragment key={elixir.type}>
            <Grid item xs={5}>
                <ElixirText elixir={elixir.type} align="right">
                    {elixir.type}
                </ElixirText>
            </Grid>
            <Grid item xs={2}>
                <ElixirText elixir={elixir.type} align="center">
                    —
                </ElixirText>
            </Grid>
            <Grid item xs={5}>
                <ElixirText elixir={elixir.type} align="left">
                    {scores[elixir.type] ?? 0}
                </ElixirText>
            </Grid>
        </Fragment>
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
};

export default ResultBreakdown;
