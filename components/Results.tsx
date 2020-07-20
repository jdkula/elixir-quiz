import { FC } from 'react';
import { Box } from '@material-ui/core';

import { AnswerMap, getScores } from '~/lib/quiz';
import ResultAssignment from './ResultAssignment';
import ResultBreakdown from './ResultBreakdown';

interface Props {
    answers: AnswerMap;
}

const Results: FC<Props> = ({ answers }) => {
    const scores = getScores(answers);

    return (
        <Box mt={3}>
            <Box width="100%" textAlign="center">
                <ResultAssignment scores={scores} />
            </Box>
            <Box m={2}>
                <ResultBreakdown scores={scores} />
            </Box>
        </Box>
    );
};

export default Results;
