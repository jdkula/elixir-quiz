import { ElixirType } from './elixir';
import { getScores, getAssignments } from './quiz';
import mongoresults from './db/mongoresults';
import { Map, Set } from 'immutable';
import { StatsReply, FullResult, StatsReqBody } from './stats';

// Returns the number of unanswered questions
export const numUnansweredQuestionsExpr = {
    $size: {
        $filter: {
            input: {
                $map: {
                    input: '$answers',
                    in: {
                        $size: '$$this.answers',
                    },
                },
            },
            cond: { $eq: ['$$this', 0] },
        },
    },
};

// Returns true if the user spent more than 20 seconds on the quiz and left less than 3 questions unanswered.
export const validResultsFilter = {
    $and: [
        {
            $lt: [numUnansweredQuestionsExpr, 3],
        },
        { $gt: ['$time', 20 * 1000] },
    ],
};

export async function getStats(): Promise<StatsReply> {
    const results = await mongoresults;

    const has = (type: ElixirType) => ({ $cond: [{ $in: [type, '$result'] }, 1, 0] });

    const winnerAggregate = await results
        .aggregate([
            {
                $project: {
                    time: true,
                    numUnansweredQuestions: numUnansweredQuestionsExpr,
                    hasTransformation: has('Transformation'),
                    hasAura: has('Aura'),
                    hasEnchantment: has('Enchantment'),
                    hasElemental: has('Elemental'),
                    hasNeutral: has('Neutral'),
                    transformationScore: '$scores.Transformation',
                    auraScore: '$scores.Aura',
                    enchantmentScore: '$scores.Enchantment',
                    elementalScore: '$scores.Elemental',
                },
            },
            {
                $match: {
                    $expr: {
                        $and: [{ $lt: ['$numUnansweredQuestions', 3] }, { $gt: ['$time', 10 * 1000] }],
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    totalResults: { $sum: 1 },
                    totalTime: { $sum: '$time' },
                    averageTime: { $avg: '$time' },
                    numTransformation: { $sum: '$hasTransformation' },
                    numAura: { $sum: '$hasAura' },
                    numEnchantment: { $sum: '$hasEnchantment' },
                    numElemental: { $sum: '$hasElemental' },
                    numNeutral: { $sum: '$hasNeutral' },
                    totalTransformationScore: { $sum: '$transformationScore' },
                    totalAuraScore: { $sum: '$auraScore' },
                    totalEnchantmentScore: { $sum: '$enchantmentScore' },
                    totalElementalScore: { $sum: '$elementalScore' },
                    averageTransformationScore: { $avg: '$transformationScore' },
                    averageAuraScore: { $avg: '$auraScore' },
                    averageEnchantmentScore: { $avg: '$enchantmentScore' },
                    averageElementalScore: { $avg: '$elementalScore' },
                },
            },
        ])
        .toArray();

    const clean: StatsReply & { _id: null } = winnerAggregate[0] ?? {
        _id: null,
        totalTime: 0,
        averageTime: 0,
        numTransformation: 0,
        numAura: 0,
        numElemental: 0,
        numEnchantment: 0,
        numNeutral: 0,
        totalAuraScore: 0,
        totalElementalScore: 0,
        totalEnchantmentScore: 0,
        totalTransformationScore: 0,
        averageAuraScore: 0,
        averageElementalScore: 0,
        averageEnchantmentScore: 0,
        averageTransformationScore: 0,
        totalResults: 0,
    };
    delete clean._id;

    return clean;
}

export async function getResults(): Promise<FullResult[]> {
    const results = await mongoresults;

    return await results.find({ $expr: validResultsFilter }).sort({ date: -1 }).toArray();
}

export async function recordStat(info: StatsReqBody): Promise<void> {
    const results = await mongoresults;

    const scores = getScores(Map(info.answers.map((res) => [res.question, Set(res.answers)])));
    const result = getAssignments(scores);

    const stats: Omit<FullResult, '_id'> = {
        ...info,
        date: new Date(info.date),
        scores,
        result,
    };

    await results.insertOne(stats);
}
