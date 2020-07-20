import { FC, useState } from 'react';
import { makeStyles, Button, Typography } from '@material-ui/core';
import { getElixir } from '~/lib/elixir';
import { FullResult } from '~/lib/stats';
import ResultDialog from './ResultDialog';

const useStyles = makeStyles({
    aura: {
        color: getElixir('Aura').color,
    },
    elemental: {
        color: getElixir('Elemental').color,
    },
    enchantment: {
        color: getElixir('Enchantment').color,
    },
    transformation: {
        color: getElixir('Transformation').color,
    },
    neutral: {
        color: getElixir('Neutral').color,
    },
});

interface Props {
    result: FullResult;
}

const StatsResults: FC<Props> = ({ result }) => {
    const classes = useStyles();
    const [modalOpen, setModal] = useState(false);

    return (
        <span>
            {result.result.map((type, i) => (
                <Button
                    key={i}
                    className={classes[type.toLowerCase()]}
                    onClick={() => setModal(true)}
                    variant="outlined"
                >
                    {type}
                    {i < result.result.length - 1 && <Typography component="span"> and</Typography>}
                </Button>
            ))}
            <ResultDialog result={result} open={modalOpen} onClose={() => setModal(false)} />
        </span>
    );
};

export default StatsResults;
