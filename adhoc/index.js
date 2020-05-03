require("../config/connection");

const { queryUpdates } = require("./queryUpdates");
// queryUpdates();
const { queryRecent } = require("./queryRecent");
queryRecent();
