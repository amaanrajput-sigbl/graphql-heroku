const { Mongoose } = require('mongoose');

let connection = null;

const connectToDB = async () => {
  const mongoose = new Mongoose();
  mongoose.Promise = global.Promise;

  let mongoUserCredentials = '';
  if (process.env.MONGO_USER && process.env.MONGO_PASSWORD) {
    mongoUserCredentials = `${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@`;
  }

  const MONGO_URL = process.env.MONGO_URL || 'localhost:27017';
  const DB_NAME = process.env.MONGO_DB_NAME || 'sample-db';
  // const MONGO_CONNECTION_STRING = `mongodb://${mongoUserCredentials}${MONGO_URL}/${DB_NAME}`;
  // const MONGO_CONNECTION_STRING = `mongodb+srv://amaanrajput940:vaisAOSuFLYAY5Do@gql-chatapp.tup50.mongodb.net/gql-chatapp?retryWrites=true&w=majority`;
    // const MONGO_CONNECTION_STRING = `mongodb://amaanrajput940:vaisAOSuFLYAY5Do@gql-chatapp-shard-00-00.tup50.mongodb.net:27017,gql-chatapp-shard-00-01.tup50.mongodb.net:27017,gql-chatapp-shard-00-02.tup50.mongodb.net:27017/gql-chatapp?ssl=true&replicaSet=atlas-hzt02s-shard-0&authSource=admin&retryWrites=true&w=majority`;
    const MONGO_CONNECTION_STRING = process.env.MONGO_DB_URI;
  await mongoose.connect(MONGO_CONNECTION_STRING);
  connection = mongoose;
};

const getDB = () => {
  if (!connection) {
    throw new Error('Call connectToDB first');
  }
  return connection;
};

module.exports = {
  connectToDB,
  getDB,
};
