"use strict";
const createModels = require("./createModels");
const getDateObject = require("./getDateObject");

console.log("in file");

async function queryUpdates() {
  try {
    console.log("in queryUpdates");
    const models = createModels();
    // console.log({ models });
    // console.log;

    const response = {};
    for (const name in models) {
      const model = models[name];
      console.log(`running query for ${name}`);
      await model.deleteMany(getDateObject("updated_at", 5, "$lt"));
    }
    console.log({ response });
    return response;
  } catch (e) {
    console.log({ e });
  }
}

module.exports = { queryUpdates };
