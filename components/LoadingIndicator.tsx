import { FC } from 'react';
import { Collapse, LinearProgress } from '@material-ui/core';

const LoadingIndicator: FC<{ loading?: boolean; error?: boolean }> = ({ loading, error }) => (
    <Collapse in={loading || error}>
        <LinearProgress
            color={error ? 'secondary' : 'primary'}
            variant={error ? 'determinate' : 'indeterminate'}
            value={error ? 100 : undefined}
        />
    </Collapse>
);

export default LoadingIndicator;
