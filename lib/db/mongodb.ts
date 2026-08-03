import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGO_URL, {  });

const mongodb = client.connect().then((mongo) => mongo.db('elixir-quiz'));
export default mongodb;
