import { QuestionId, Scores, AnswerMap } from './quiz';
import { ScoredElixirType, ElixirType } from './elixir';
import Axios from 'axios';
import GlobalTimer from '~/components/GlobalTimer';

export interface AnswerResult {
    question: QuestionId;
    answers: ScoredElixirType[];
}

export interface StatsReqBody {
    answers: AnswerResult[];
    time: number;
    date: Date;
}

export interface FullResult extends StatsReqBody {
    scores: Scores;
    result: ElixirType[];
    _id: string;
}

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

export async function sendStat(answers: AnswerMap): Promise<void> {
    const collated: AnswerResult[] = [];

    answers.entrySeq().forEach(([qid, aset]) =>
        collated.push({
            question: qid,
            answers: aset.toArray(),
        }),
    );

    await Axios.post('/api/stats', {
        answers: collated,
        time: GlobalTimer.time(),
        date: new Date(),
    } as StatsReqBody);
}
