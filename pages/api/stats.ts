import { NextApiHandler } from "next";
import mongoresults from "~/lib/mongoresults";
import { StatsReqBody, FullResult as StatsType } from "~/lib/mongostats";
import { getScores, getAssignments } from "~/lib/quiz";
import { Map, Set } from "immutable";
import { numUnansweredQuestionsExpr } from "./results";
import { ElixirType } from "~/lib/elixir";

export interface StatsReply {
    totalTime: number;
    averageTime: number;
    numTransformation: number;
    numAura: number;
    numEnchantment: number;
    numElemental: number;
    numNeutral: number;
    totalTransformationScore: number;
    totalAuraScore: number;
    totalEnchantmentScore: number;
    totalElementalScore: number;
    totalResults: number;
    averageAuraScore: number;
    averageElementalScore: number;
    averageEnchantmentScore: number;
    averageTransformationScore: number;
}

const StatsGET: NextApiHandler = async (req, res) => {
    const results = await mongoresults;

    const has = (type: ElixirType) => ({ $cond: [{ $in: [type, "$result"] }, 1, 0] });

    const winnerAggregate = await results
        .aggregate([
            {
                $project: {
                    time: true,
                    numUnansweredQuestions: numUnansweredQuestionsExpr,
                    hasTransformation: has("Transformation"),
                    hasAura: has("Aura"),
                    hasEnchantment: has("Enchantment"),
                    hasElemental: has("Elemental"),
                    hasNeutral: has("Neutral"),
                    transformationScore: "$scores.Transformation",
                    auraScore: "$scores.Aura",
                    enchantmentScore: "$scores.Enchantment",
                    elementalScore: "$scores.Elemental",
                },
            },
            {
                $match: {
                    $expr: {
                        $and: [{ $lt: ["$numUnansweredQuestions", 3] }, { $gt: ["$time", 10 * 1000] }],
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    totalResults: { $sum: 1 },
                    totalTime: { $sum: "$time" },
                    averageTime: { $avg: "$time" },
                    numTransformation: { $sum: "$hasTransformation" },
                    numAura: { $sum: "$hasAura" },
                    numEnchantment: { $sum: "$hasEnchantment" },
                    numElemental: { $sum: "$hasElemental" },
                    numNeutral: { $sum: "$hasNeutral" },
                    totalTransformationScore: { $sum: "$transformationScore" },
                    totalAuraScore: { $sum: "$auraScore" },
                    totalEnchantmentScore: { $sum: "$enchantmentScore" },
                    totalElementalScore: { $sum: "$elementalScore" },
                    averageTransformationScore: { $avg: "$transformationScore" },
                    averageAuraScore: { $avg: "$auraScore" },
                    averageEnchantmentScore: { $avg: "$enchantmentScore" },
                    averageElementalScore: { $avg: "$elementalScore" },
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

    res.json(clean);
};

const StatsPOST: NextApiHandler = async (req, res) => {
    const results = await mongoresults;

    const statsSubmission: StatsReqBody = req.body;
    const scoreMap = getScores(Map(statsSubmission.answers.map((res) => [res.question, Set(res.answers)])));
    const winners = getAssignments(scoreMap);

    const stats: Omit<StatsType, "_id"> = {
        ...statsSubmission,
        date: new Date(statsSubmission.date),
        scores: scoreMap.toJSON() as any,
        result: winners,
    };

    await results.insertOne(stats);
    res.status(200).end();
};

const Stats: NextApiHandler = async (req, res) => {
    if (req.method === "POST") {
        return await StatsPOST(req, res);
    } else if (req.method === "GET") {
        return await StatsGET(req, res);
    }

    res.status(405).end();
};

export default Stats;
