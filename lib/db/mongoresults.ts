import mongodb from './mongodb';

const mongoresults = mongodb.then((db) => db.collection('results'));

export default mongoresults;
