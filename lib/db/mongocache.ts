import mongodb from './mongodb';
import { ObjectId } from 'mongodb';
import { Question } from '../quiz';
import moment from 'moment';

export const kCacheId = new ObjectId('CACHE__CACHE');
export const kCacheExpiry = moment.duration(1, 'hour');

export interface MongoCache {
    questions: Question[];
    expires: Date;
}

const mongocache = mongodb.then((db) => db.collection('cache'));

export default mongocache;
