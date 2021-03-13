import { GraphQLServer, PubSub } from "graphql-yoga";
import db from "./db";
import {
  Query,
  Mutation,
  User,
  Post,
  Comment,
  Subscription,
} from "./resolvers";
import prisma from "./prisma";

// Scalar types - String, Booleanm, Int, Float, ID

const pubSub = new PubSub();

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers: {
    Query,
    Mutation,
    User,
    Post,
    Comment,
    Subscription,
  },
  context: (request) => {
    return {
      db,
      pubSub,
      prisma,
      request,
    };
  },
});

server.start((port) => {
  console.log({ port });
  console.log("The server is up.");
});
