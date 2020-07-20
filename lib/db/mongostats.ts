import mongodb from './mongodb';

const mongostats = mongodb.then((db) => db.collection('stats'));

export default mongostats;
