// import "core-js/stable";
// import "regenerator-runtime/runtime";
import server from "../src/server";

server.start({ port: process.env.PORT || 4000 }, () => {
  console.log("The server is up!");
});
