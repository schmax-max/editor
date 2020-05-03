"use strict";
const mongoose = require("mongoose");
const getDateObject = require("./getDateObject");

const schema = new mongoose.Schema({
  _type: {
    type: "string",
  },
  _id: {
    type: "ObjectId",
  },
  content_url: {
    type: "string",
  },
  updated_at: {
    type: "date",
    format: "date-time",
  },
  body: {
    type: "object",
  },
});

schema.set("toJSON", { virtuals: true });

schema.statics.queryCategory = async function (allocations, limit) {
  const categoryRes = {};
  for (let i = 0; i < allocations.length; i++) {
    const allocation = allocations[i];
    categoryRes[allocation] = await this.queryAllocation(allocations[i], limit);
  }
  // console.log({ categoryRes });
  return categoryRes;
};

schema.statics.queryAllocation = async function (allocation, limit) {
  const queryAllocation = { "body.locations.allocation": allocation };
  const findAllocation = Object.assign(queryAllocation, getDateObject(3));
  // console.log({ findAllocation });
  const allocationRes = await this.find(findAllocation)
    .sort({ "body.scores.combined": -1 })
    .limit(limit);
  // console.log({ allocationRes });
  return allocationRes;
};

schema.statics.querySelection = async function (categories, limit) {
  let iterations = categories.length;

  const selectionRes = {};
  for (let i = 0; i < iterations; i++) {
    const category = categories[i];
    selectionRes[category] = await this.queryEntireCategory(limit, category);
  }
  // console.log({ selectionRes });
  return selectionRes;
};

schema.statics.queryEntireCategory = async function (limit, category) {
  const queryCategory = { "body.locations.category": category };
  const findCategory = Object.assign(queryCategory, getDateObject(3));
  // console.log({ findCategory });
  const categoryRes = await this.find(findCategory)
    .sort({ "body.scores.combined": -1 })
    .limit(limit);
  // console.log({ categoryRes });
  return categoryRes;
};

schema.statics.queryNoisefree = async function () {
  const queryLength = { "body.core.content_minutes": { $gt: 6, $lt: 20 } };
  const queryType = { "body.core.content_type": { $in: ["article", "video"] } };
  // const queryCategory = { "body.locations.area": "noisefree" };

  const find = Object.assign(
    {},
    queryLength,
    queryType,
    // queryCategory,
    getDateObject(3)
    //
  );
  console.log({ find });
  const res = await this.find(find)
    .sort({ "body.scores.combined": -1 })
    .limit(24);

  console.log({ res });
  return res;
};

schema.statics.querySports = async function (category) {
  const queryLength = { "body.core.content_minutes": { $gt: 6, $lt: 20 } };
  const queryType = { "body.core.content_type": { $in: ["article", "video"] } };
  const queryCategory = { "body.locations.category": category };
  const find = Object.assign(
    {},
    queryLength,
    queryType,
    queryCategory,
    getDateObject(3)
  );
  // console.log({ find });
  const res = await this.find(find)
    .sort({ "body.scores.combined": -1 })
    // .skip(skip)
    .limit(24);
  // console.log({ res });
  return res;
};

schema.statics.search = async function (term, limit) {
  if (term) term = term.toLowerCase();
  const queryLength = { "body.core.content_minutes": { $gt: 2, $lt: 60 } };
  const queryType = { "body.core.content_type": { $in: ["article", "video"] } };
  const queryTerm = { "body.search_words": term };
  const find = Object.assign(
    {},
    queryTerm,
    queryLength,
    queryType,
    getDateObject(20)
  );
  console.log({ find });
  const res = await this.find(find)
    .sort({ "body.scores.combined": -1 })
    .limit(limit);
  return res;
};

// schema.statics.searchBbh = async function(term, limit) {
//   term = "christian wood";
//   const queryCategory = { "body.locations.category": "basketball" };
//   const queryTerm = { "body.word_arrays.category": "basketball" };
//   const find = Object.assign({}, queryCategory, getDateObject(20));
//   console.log({ find });
//   const res = await this.find(find)
//     .sort({ "body.scores.combined": -1 })
//     // .skip(skip)
//     .limit(limit);
//   // console.log({ res });
//   return res;
// };

function createModels() {
  const collections = [
    "mimis",
    "noisefree",
    "culture",
    "potluck",
    "identity",
    "health",
    "voodoo",
    "sports",
    "bbh",
  ];
  const models = {};
  collections.forEach((collection) => {
    models[collection] = mongoose.model(
      `piles_${collection}`,
      schema,
      `piles_${collection}`
    );
  });
  return models;
}

module.exports = createModels();
