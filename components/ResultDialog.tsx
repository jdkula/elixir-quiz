import {
    DialogProps,
    Dialog,
    Collapse,
    LinearProgress,
    DialogTitle,
    DialogContent,
    Box,
    Typography,
    DialogActions,
    Button,
} from '@material-ui/core';
import { FullResult } from '~/lib/stats';
import { FC, useEffect } from 'react';
import useQuestions from '~/lib/useQuestions';
import { AnswerMap } from '~/lib/quiz';
import moment from 'moment';
import Quiz from './Quiz';
import { Map, Set } from 'immutable';
import Results from './Results';

interface ResultDialogProps extends DialogProps {
    result: FullResult;
}

const ResultDialog: FC<ResultDialogProps> = ({ result, open, ...rest }) => {
    const [questions, loading, error, load] = useQuestions(null, false, result._id, true);

    const answerMap: AnswerMap = Map(result.answers.map((answer) => [answer.question, Set(answer.answers)]));

    const duration = moment.duration(result.time);
    const durationFormatted = `${duration.minutes()}m ${duration.seconds()}s`;

    const date = moment(result.date);
    const dateFormatted = date.format('dddd, MMM Do [at] h:mm a');

    useEffect(() => {
        if (open && loading) {
            load();
        }
    }, [open]);

    return (
        <Dialog open={open} {...rest}>
            <Collapse in={loading || error}>
                <LinearProgress
                    color={error ? 'secondary' : 'primary'}
                    variant={error ? 'determinate' : 'indeterminate'}
                    value={error ? 100 : undefined}
                />
            </Collapse>
            <DialogTitle>Result Details</DialogTitle>
            <DialogContent dividers>
                <Box textAlign="center">
                    <Typography>
                        This quiz was completed in {durationFormatted} on {dateFormatted}
                    </Typography>
                </Box>
                <Results answers={answerMap} />
                <Box textAlign="center">
                    {loading && <Typography variant="overline">Loading questions...</Typography>}
                    {error && <Typography variant="overline">Failed to load questions</Typography>}
                </Box>
                {!error && !loading && (
                    <Quiz
                        showingResults={true}
                        started={true}
                        setAnswers={() => {
                            void 0; // do nothing.
                        }}
                        questions={questions}
                        answers={answerMap}
                        isModal
                    />
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => rest.onClose?.({}, 'escapeKeyDown')}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ResultDialog;
