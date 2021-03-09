import { Prisma } from "prisma-binding";

const prisma = new Prisma({
  typeDefs: "schemas/database.graphql",
  endpoint: "localhost:4466",
});
