import "cross-fetch/polyfill";
import ApolloBoost, { gql } from "apollo-boost";

const client = new ApolloBoost({ uri: "http://localhost:4000" });

test("Create new user", async () => {
  const createUser = gql`
    mutation {
      createUser(
        data: {
          name: "Alex"
          email: "alex124@mailinaoe.com"
          password: "adminpass@123"
        }
      ) {
        user {
          id
          name
          email
        }
        token
      }
    }
  `;

  const response = await client.mutate({ mutation: createUser });
  console.log({ response });
});
