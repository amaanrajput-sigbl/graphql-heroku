import express from 'express';
import bodyParser from 'body-parser';
const graphqlHTTP = require("express-graphql");
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
const expressPlayground = require("graphql-playground-middleware-express").default;

import { connectToDB } from './database';

// Start the http server
const startServer = async () => {
  const { User } = require('./database/models');

  // GraphQL Types
  const typeDefs = `
    type User {
      _id: ID!
      name: String
      password: String
    }

    type Query {
      users: [User]
    }


    type Mutation {
      addUser(input: UserInput): User
    }

    input UserInput {
      name: String!
      password: String!
    }
  `;

  // GraphQL resolvers
  const resolvers = {
    Query: {
      users: async () => {
        const res = await User.find();
        return res;
      },
    },

    Mutation: {
      addUser: async(root, args) => {
        const res = await User.create(args.input);
        return res;
      },
    },
  };

  // Define a schema
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  // Initiate express and define routes
  // const app = express();
  // app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
  // app.use('/', graphiqlExpress({ endpointURL: '/graphql' }));
  const app = express();

  // Connecting to DB and then start the server
const dbConnectAndStartServer = async () => {
  try {
    await connectToDB();
    console.log('Connected to Mongo successfully');
    startServer();
  } catch (err) {
    console.error(`Error connecting to mongo - ${err.message}`);
    process.exit(1);
  }
};

// Entry point
dbConnectAndStartServer();

  app.use(
    "/graphql",
    graphqlHTTP({
      schema,
      rootValue: resolvers,
      dbConnectAndStartServer
    })
  );

  //Graphql Playground route
  app.get("/playground", expressPlayground({ endpoint: "/graphql" }));

  // Initiate the server
  //process.env.PORT || 3000
  app.listen(3000, () => {
    console.log(`Server started on port: ${process.env.PORT || 3000}`);
  });
};


