import mongodb from './mongodb';
import { ObjectId } from 'mongodb';
import { Question } from '../quiz';
import moment from 'moment';

export const kCacheId = 'CACHE__CACHE';
export const kCacheExpiry = moment.duration(1, 'hour');

export interface MongoCache {
    _id: string;
    questions: Question[];
    expires: Date;
}

const mongocache = mongodb.then((db) => db.collection<MongoCache>('cache'));

export default mongocache;
