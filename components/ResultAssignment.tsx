import { FC, Fragment } from 'react';
import { getElixir } from '~/lib/elixir';
import { getAssignments, Scores } from '~/lib/quiz';
import { Typography, Box } from '@material-ui/core';
import ElixirText from './ElixirText';

interface Props {
    scores: Scores;
}

const ResultAssignment: FC<Props> = ({ scores }) => {
    const winners = getAssignments(scores);

    if (winners.length === 1 && winners[0] === 'Neutral') {
        return (
            <Typography variant="h4">
                You are elixir-
                <ElixirText bold elixir="Neutral" variant="h4" component="span">
                    neutral
                </ElixirText>
                !
            </Typography>
        );
    }

    const particle = getElixir(winners[0]).particle;
    const result = winners.map((out, i) => (
        <Fragment key={out}>
            <ElixirText bold elixir={out} variant="h4" component="span">
                {out}
            </ElixirText>
            {i < winners.length - 1 && <Box component="span"> or </Box>}
        </Fragment>
    ));

    return (
        <Typography variant="h4">
            You are {particle} {result} elixir user!
        </Typography>
    );
};

export default ResultAssignment;
