const moment = require("moment-timezone");

module.exports = getDateObject;

function getDateObject(key, operator, days) {
  let date = moment()
    .tz("America/Chicago")
    .subtract(days, "days")
    .toISOString();
  // console.log({ date });

  const firstObj = {};
  const secondObj = {};
  const firstObjVal = {};
  firstObjVal[operator] = date;

  firstObj[key] = firstObjVal;
  secondObj[key] = { $exists: true };
  return {
    $and: [firstObj, secondObj],
  };
}
