import { FullResult } from '../stats';
import mongodb from './mongodb';

const mongoresults = mongodb.then((db) => db.collection<FullResult>('results'));

export default mongoresults;
