const Joi = require("@hapi/joi");
exports.body = Joi.object({
  core: Joi.object().required(),
  scores: Joi.object().required(),
  search_words: Joi.array(),
  locations: Joi.object().required()
});

exports.bodyServer = Joi.object({
  client: Joi.string(),
  allocations: Joi.array().items(Joi.string()),
  allocation: Joi.string(),
  searchTerms: Joi.string()
});
