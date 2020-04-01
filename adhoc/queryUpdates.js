"use strict";
const mongoose = require("mongoose");
const moment = require("moment-timezone");
const dateObjects = require("../model/dateObjects");

const schema = new mongoose.Schema({
  updated_at: {
    type: "date"
  }
});

schema.set("toJSON", { virtuals: true });

console.log("in file");

// niche: ["allocations", "areas", "categories"],

function createModels() {
  const collections = {
    reference_bubble: ["center", "left_center", "right_center", "pro_science"],
    reference_newsletter: ["others", "podcasts"],
    reference_snapshot: ["curators", "photos", "publishers", "slugs"],
    reference_twitter: ["others", "sports"],
    reference: ["citations"],
    library: ["articles", "photos", "podcasts", "videos"],
    scan: ["articles", "photos", "podcasts", "videos"],
    piles: [
      "mimis",
      "noisefree",
      "culture",
      "potluck",
      "identity",
      "health",
      "voodoo",
      "sports",
      "bbh"
    ]
  };
  const models = {};
  Object.keys(collections).forEach(type => {
    const array = collections[type];
    array.forEach(item => {
      const modelName = `${type}_${item}`;
      models[modelName] = mongoose.model(modelName, schema, modelName);
    });
  });

  return models;
}

function identifyRecent() {
  const days = 1;

  let date = moment()
    .tz("America/Chicago")
    .subtract(days, "days")
    .toISOString();
  return {
    $and: [{ updated_at: { $gt: date } }, { updated_at: { $exists: true } }]
  };
}

function identifyOld() {
  const days = 5;

  let date = moment()
    .tz("America/Chicago")
    .subtract(days, "days")
    .toISOString();
  return {
    $and: [{ updated_at: { $lt: date } }, { updated_at: { $exists: true } }]
  };
}

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
      response[name] = await model.countDocuments(identifyRecent());
      // await model.deleteMany(identifyOld());
      // console.log({ response });
    }
    // console.log({ response });
    return response;
  } catch (e) {
    console.log({ e });
  }
}

module.exports = { queryUpdates };
