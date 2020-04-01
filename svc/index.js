const { gateway } = require("./gateway");
const { server } = require("./server");
const postData = require("../config/postData");
const moment = require("moment-timezone");
const { Pile } = require("../model");

module.exports = { master, commander };

async function master(req) {
  if (gateway(req)) {
    if (req.params.trigger === "server") {
      const response = await server(req.body);
      return response;
    } else {
      return await commander(req.body);
    }
  } else {
    return;
  }
}

async function commander(body) {
  try {
    if (gateway(body)) {
      const { area, category, allocation } = body.locations;
      const { content_url, content_type } = body.core;
      const updated_at = moment()
        .tz("America/Chicago")
        .toISOString();
      const find = { content_url };
      const item = { body, updated_at };
      const options = { new: true, upsert: true };
      if (category === "basketball") {
        await Pile[`bbh`].findOneAndUpdate(find, item, options);
      }
      if (!Pile[area]) {
        console.log("no model");
        console.log({ lo: body.locations });
        return {};
      } else {
        const result = await Pile[`${area}`].findOneAndUpdate(
          find,
          item,
          options
        );
        return result;
      }
    } else {
      return;
    }
  } catch (e) {
    console.log({ e });
    return;
  }
}
