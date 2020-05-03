"use strict";
const createModels = require("./createModels");
const getDateObject = require("./getDateObject");

async function queryRecent() {
  try {
    console.log("in queryRecent");
    const models = createModels();
    // console.log({ models });
    // console.log;
    const response = {};
    for (const name in models) {
      const model = models[name];
      console.log(`running query for ${name}`);
      const find = getDateObject("body.core.publication_date", 1, "$gt");
      // const find = getDateObject("updated_at", 1, "$gt");
      console.log({ find });
      response[name] = await model.find(find).limit(1).skip(3);
      // await model.deleteMany(identifyOld());
      // console.log({ response });
    }
    console.log({ a: response["piles_noisefree"][0] });
    return response;
  } catch (e) {
    console.log({ e });
  }
}

module.exports = { queryRecent };
