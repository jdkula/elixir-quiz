import { FC, useState } from 'react';
import { makeStyles, Button, Typography, Box } from '@material-ui/core';
import { getElixir } from '~/lib/elixir';
import { FullResult } from '~/lib/stats';
import ResultDialog from './ResultDialog';
import ElixirText from './ElixirText';

const useStyles = makeStyles({
    Aura: {
        color: getElixir('Aura').color,
    },
    Elemental: {
        color: getElixir('Elemental').color,
    },
    Enchantment: {
        color: getElixir('Enchantment').color,
    },
    Transformation: {
        color: getElixir('Transformation').color,
    },
    Neutral: {
        color: getElixir('Neutral').color,
    },
});

interface Props {
    result: FullResult;
}

const StatsResults: FC<Props> = ({ result }) => {
    const classes = useStyles();
    const [modalOpen, setModal] = useState(false);

    const buttonClass = result.result.length > 1 ? classes.Neutral : classes[result.result[0]];

    return (
        <span>
            <Button className={buttonClass} onClick={() => setModal(true)} variant="outlined">
                <Box display="inline-flex" flexDirection="column" alignItems="center">
                    {result.result.map((type, i) => (
                        <ElixirText variant="inherit" key={i} $elixir={type}>
                            {type}
                            {i < result.result.length - 1 && (
                                <Typography variant="inherit" color="textPrimary">
                                    {' '}
                                    or
                                </Typography>
                            )}
                        </ElixirText>
                    ))}
                </Box>
            </Button>

            <ResultDialog result={result} open={modalOpen} onClose={() => setModal(false)} />
        </span>
    );
};

export default StatsResults;
