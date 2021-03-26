import "core-js/stable";
import "regenerator-runtime/runtime";
const server = require("../../src/server").default;

module.exports = async () => {
  global.__MOD__ = await server.start({ port: 4000 }, () => {
    console.log("Test server up");
  });
};
