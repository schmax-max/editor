"use strict";
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  updated_at: {
    type: "date",
  },
});

schema.set("toJSON", { virtuals: true });

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
      "bbh",
    ],
  };
  const models = {};
  Object.keys(collections).forEach((type) => {
    const array = collections[type];
    array.forEach((item) => {
      const modelName = `${type}_${item}`;
      models[modelName] = mongoose.model(modelName, schema, modelName);
    });
  });

  return models;
}

module.exports = createModels;
