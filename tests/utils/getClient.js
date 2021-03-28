import ApolloBoost from "apollo-boost";

export default (token) =>
  new ApolloBoost({
    uri: "http://localhost:4000",
    request(operation) {
      if (token) {
        operation.setContext({
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    },
  });
