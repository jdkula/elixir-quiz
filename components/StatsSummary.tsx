import { FC } from 'react';
import { Box, withStyles, Typography, Container } from '@material-ui/core';
import ElixirText from './ElixirText';
import moment from 'moment';
import { StatsReply } from '~/lib/stats';
import { truncate } from '~/lib/util';

const StatsItem: FC = ({ children }) => <Box my={2}>{children}</Box>;

const StatsPoint = withStyles({
    root: {
        fontWeight: 'bold',
    },
})((props) => <Typography component="span" {...props} />);

function wasWere(quantity: number): 'was' | 'were' {
    return quantity === 1 ? 'was' : 'were';
}

interface ElixirPointsProps {
    aura: number;
    elemental: number;
    enchantment: number;
    transformation: number;
}

const ElixirPoints: FC<ElixirPointsProps> = ({ aura, elemental, enchantment, transformation }) => (
    <Container>
        <ElixirText elixir="Aura" bold>
            Aura recieved {truncate(aura, 2)} points,
        </ElixirText>
        <ElixirText elixir="Elemental" bold>
            Elemental recieved {truncate(elemental, 2)} points
        </ElixirText>
        <ElixirText elixir="Enchantment" bold>
            Enchantment recieved {truncate(enchantment, 2)} points,
            <Typography component="span"> and</Typography>
        </ElixirText>
        <ElixirText elixir="Transformation" bold>
            Transformation recieved {truncate(transformation, 2)} points.
        </ElixirText>
    </Container>
);

const StatsSummary: FC<{ stats: StatsReply }> = ({ stats }) => {
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
                    Cumulatively, the people of the universe have spent a total of{' '}
                    <StatsPoint>
                        {totalTime.hours()} hours, {totalTime.minutes()} minutes, and {totalTime.seconds()} seconds
                    </StatsPoint>{' '}
                    evaluating their elixir types, averaging{' '}
                    <StatsPoint>
                        {averageTime.minutes()}:{averageTime.seconds().toString().padStart(2, '0')}
                    </StatsPoint>{' '}
                    per quiz!
                </Typography>
            </StatsItem>
            <StatsItem>
                <Typography>Of those results,</Typography>
                <Container>
                    <ElixirText elixir="Aura" bold>
                        {stats.numAura} {wasWere(stats.numAura)} assigned to Aura,
                    </ElixirText>
                    <ElixirText elixir="Elemental" bold>
                        {stats.numElemental} {wasWere(stats.numElemental)} assigned to Elemental,
                    </ElixirText>
                    <ElixirText elixir="Enchantment" bold>
                        {stats.numEnchantment} {wasWere(stats.numEnchantment)} assigned to Enchantment,
                    </ElixirText>
                    <ElixirText elixir="Transformation" bold>
                        {stats.numTransformation} {wasWere(stats.numTransformation)} assigned to Transformation,
                        <Typography component="span"> and</Typography>
                    </ElixirText>
                    <ElixirText elixir="Neutral" bold>
                        {stats.numNeutral} {wasWere(stats.numNeutral)} assigned to Neutral.
                    </ElixirText>
                </Container>
            </StatsItem>
            <StatsItem>
                <Typography>Across all the quiz results,</Typography>
                <ElixirPoints
                    aura={stats.totalAuraScore}
                    elemental={stats.totalElementalScore}
                    enchantment={stats.totalEnchantmentScore}
                    transformation={stats.totalTransformationScore}
                />
            </StatsItem>
            <StatsItem>
                <Typography>On average,</Typography>
                <ElixirPoints
                    aura={stats.averageAuraScore}
                    elemental={stats.averageElementalScore}
                    enchantment={stats.averageEnchantmentScore}
                    transformation={stats.averageTransformationScore}
                />
            </StatsItem>
        </Container>
    );
};

export default StatsSummary;
