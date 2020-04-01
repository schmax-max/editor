"use strict";
const moment = require("moment-timezone");

module.exports = function getDateObject(days) {
  let date = moment()
    .tz("America/Chicago")
    .subtract(days, "days")
    .toISOString();
  return {
    $and: [
      { "body.core.publication_date": { $gt: date } },
      { "body.core.publication_date": { $exists: true } }
    ]
  };
};
