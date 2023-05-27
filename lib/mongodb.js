import { MongoClient } from 'mongodb'

const uri =  process.env.MONGO_DB_URI;
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

let client;

let clientPromise;

if (!process.env.MONGO_DB_URI) {
    throw new Error('Add Mongo URI to .env.local')
  };

client = new MongoClient(uri, options);
clientPromise = client.connect();

export default clientPromise
