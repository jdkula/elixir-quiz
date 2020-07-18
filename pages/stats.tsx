import { ReactElement, ReactNode } from "react";
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
} from "@material-ui/core";

import Link from "next/link";
import { useRouter } from "next/router";
import { getElixir } from "~/lib/elixir";
import useResults from "~/lib/useResults";

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
                            Transformation recieved {stats.averageEnchantmentScore} points.
                        </Typography>
                    </StatsPoint>
                </Container>
            </StatsItem>
        </Container>
    );
}

export default function StatsPage(): ReactElement {
    const [, loading] = useStats();
    const [results, resultsLoading] = useResults();
    const router = useRouter();

    const classes = useStyles();

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
            <Stats />
            {!resultsLoading && (
                <Typography>
                    The last {Math.min(results.length, 5)} results were:{" "}
                    {results
                        .slice(0, 5)
                        .map((v) => v.result)
                        .map((res, i, arr) => (
                            <StatsPoint key={i}>
                                {res.map((type, j) => (
                                    <Typography
                                        component="span"
                                        key={i + " " + j}
                                        className={classes[type.toLowerCase()]}
                                    >
                                        {type}
                                        {j < res.length - 1 && ", "}
                                    </Typography>
                                ))}
                                <StatsAnd>
                                    {i < arr.length - 1 && ", "}
                                    {i === arr.length - 2 && "and "}
                                    {i === arr.length - 1 && "."}
                                </StatsAnd>
                            </StatsPoint>
                        ))}
                </Typography>
            )}
        </AppContainer>
    );
}
