const Joi = require('@hapi/joi');
exports.params = Joi.object({
  trigger: Joi.string(),
})