require("./config/connection");

const { commander } = require("./svc");
const { server } = require("./svc/server");
const { body, params } = require("./tests/data");

console.log("in play");

// commander(body).then((res) => {
//   // console.log({res})
// })

// server(params).then(res => {
//   // console.log({res})
// });
