import { ReactElement, ReactNode, useState } from "react";
import useStats from "~/lib/useStats";
import AppContainer from "~/components/AppContainer";
import moment from "moment";
import {
    Button,
    Collapse,
    LinearProgress,
    Box,
    Container,
    makeStyles,
    Typography,
    withStyles,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@material-ui/core";

import Link from "next/link";
import { useRouter } from "next/router";
import { getElixir } from "~/lib/elixir";
import useResults from "~/lib/useResults";
import Head from "next/head";
import { FullResult } from "~/lib/mongostats";
import Quiz from "~/components/Quiz";
import useQuestions from "~/lib/useQuestions";
import { AnswerMap } from "~/lib/quiz";
import { Map, Set } from "immutable";
import Results from "~/components/Results";

const useStyles = makeStyles({
    aura: {
        color: getElixir("Aura").color,
    },
    elemental: {
        color: getElixir("Elemental").color,
    },
    enchantment: {
        color: getElixir("Enchantment").color,
    },
    transformation: {
        color: getElixir("Transformation").color,
    },
    neutral: {
        color: getElixir("Neutral").color,
    },
});

const StatsItem = ({ children }: { children?: ReactNode }) => <Box my={2}>{children}</Box>;
const StatsAnd = withStyles({
    notBold: { fontWeight: "normal !important" as any, color: "initial" },
})(({ children, classes }: { children?: ReactNode; classes: any }) => (
    <Box component="span" className={classes.notBold}>
        {children || " and"}
    </Box>
));
const StatsPoint = withStyles({
    bold: {
        fontWeight: "bold",
        "& *": {
            fontWeight: "bold",
        },
    },
})(({ children, classes }: { children?: ReactNode; classes: any }) => (
    <Box component="span" className={classes.bold}>
        {children}
    </Box>
));

function wasWere(quantity: number): "was" | "were" {
    return quantity === 1 ? "was" : "were";
}

function Stats(): ReactElement {
    const styles = useStyles();
    const [stats, loading] = useStats();

    if (loading) {
        return null;
    }

    const totalTime = moment.duration(stats.totalTime);
    const averageTime = moment.duration(stats.averageTime);

    return (
        <Container>
            <StatsItem>
                <Typography>
                    The Quiz has been taken a total of <StatsPoint>{stats.totalResults}</StatsPoint> times.
                </Typography>
            </StatsItem>
            <StatsItem>
                <Typography>
                    Cumulatively, the people of the universe have spent a total of{" "}
                    <StatsPoint>
                        {totalTime.hours()} hours, {totalTime.minutes()} minutes, and {totalTime.seconds()} seconds
                    </StatsPoint>{" "}
                    evaluating their elixir types, averaging{" "}
                    <StatsPoint>
                        {averageTime.minutes()}:{averageTime.seconds().toString().padStart(2, "0")}
                    </StatsPoint>{" "}
                    per quiz!
                </Typography>
            </StatsItem>
            <StatsItem>
                <Typography>Of those results,</Typography>
                <Container>
                    <StatsPoint>
                        <Typography className={styles.aura}>
                            {stats.numAura} {wasWere(stats.numAura)} assigned to Aura,
                        </Typography>
                        <Typography className={styles.elemental}>
                            {stats.numElemental} {wasWere(stats.numElemental)} assigned to Elemental,
                        </Typography>
                        <Typography className={styles.enchantment}>
                            {stats.numEnchantment} {wasWere(stats.numEnchantment)} assigned to Enchantment,
                        </Typography>
                        <Typography className={styles.transformation}>
                            {stats.numTransformation} {wasWere(stats.numTransformation)} assigned to Transformation,
                            <StatsAnd />
                        </Typography>
                        <Typography className={styles.neutral}>
                            {stats.numNeutral} {wasWere(stats.numNeutral)} assigned to Neutral.
                        </Typography>
                    </StatsPoint>
                </Container>
            </StatsItem>
            <StatsItem>
                <Typography>Across all the quiz results,</Typography>
                <Container>
                    <StatsPoint>
                        <Typography className={styles.aura}>Aura recieved {stats.totalAuraScore} points,</Typography>
                        <Typography className={styles.elemental}>
                            Elemental recieved {stats.totalElementalScore} points
                        </Typography>
                        <Typography className={styles.enchantment}>
                            Enchantment recieved {stats.totalEnchantmentScore} points,
                            <StatsAnd />
                        </Typography>
                        <Typography className={styles.transformation}>
                            Transformation recieved {stats.totalTransformationScore} points.
                        </Typography>
                    </StatsPoint>
                </Container>
            </StatsItem>
            <StatsItem>
                <Typography>On average,</Typography>
                <Container>
                    <StatsPoint>
                        <Typography className={styles.aura}>Aura recieved {stats.averageAuraScore} points,</Typography>
                        <Typography className={styles.elemental}>
                            Elemental recieved {stats.averageElementalScore} points
                        </Typography>
                        <Typography className={styles.enchantment}>
                            Enchantment recieved {stats.averageEnchantmentScore} points,
                            <StatsAnd />
                        </Typography>
                        <Typography className={styles.transformation}>
                            Transformation recieved {stats.averageTransformationScore} points.
                        </Typography>
                    </StatsPoint>
                </Container>
            </StatsItem>
        </Container>
    );
}

function Result({ result }: { result: FullResult }): ReactElement {
    const classes = useStyles();
    const [modalOpen, setModal] = useState(false);
    const [questions, loading, error, load] = useQuestions(null, false, false, result._id);

    const answerMap: AnswerMap = Map(result.answers.map((answer) => [answer.question, Set(answer.answers)]));

    const duration = moment.duration(result.time);
    const durationFormatted = `${duration.minutes()}m ${duration.seconds()}s`;

    const time = moment(result.date);
    const timeFormatted = time.format("dddd, MMM Do [at] h:mm a");

    const openModal = () => {
        setModal(true);
        load();
    };

    return (
        <span>
            {result.result.map((type, i) => (
                <Button key={i} className={classes[type.toLowerCase()]} onClick={openModal} variant="outlined">
                    {type}
                    {i < result.result.length - 1 && (
                        <>
                            <StatsAnd />,
                        </>
                    )}
                </Button>
            ))}
            <Dialog open={modalOpen} onClose={() => setModal(false)}>
                <Collapse in={loading || error}>
                    <LinearProgress
                        color={error ? "secondary" : "primary"}
                        variant={error ? "determinate" : "indeterminate"}
                        value={error ? 100 : undefined}
                    />
                </Collapse>
                <DialogTitle>Result Details</DialogTitle>
                <DialogContent dividers>
                    <Box textAlign="center">
                        <Typography>
                            This quiz was completed in {durationFormatted} on {timeFormatted}
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
                    <Button onClick={() => setModal(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </span>
    );
}

export default function StatsPage(): ReactElement {
    const [, loading] = useStats();
    const [results, resultsLoading] = useResults();
    const router = useRouter();

    return (
        <AppContainer
            below={
                <Collapse in={loading || resultsLoading}>
                    <LinearProgress />
                </Collapse>
            }
            right={
                <Link href="/">
                    <Button onClick={() => router.push("/")}>Return to Quiz</Button>
                </Link>
            }
        >
            <Head>
                <title>Elixir Quiz Stats</title>
            </Head>
            <Stats />
            {!resultsLoading && (
                <Container>
                    <Typography>Here are the latest results! </Typography>
                    <Box m={2} display="flex" flexDirection="column" width="min-content" alignItems="center">
                        {results.map((res, i) => (
                            <Box component="div" m={1} key={i}>
                                <StatsPoint>
                                    <Result result={res} />
                                </StatsPoint>
                            </Box>
                        ))}
                    </Box>
                </Container>
            )}
        </AppContainer>
    );
}
