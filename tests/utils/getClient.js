import ApolloBoost from "apollo-boost";

export default (configuration = {}) =>
  new ApolloBoost({ uri: "http://localhost:4000", ...configuration });
