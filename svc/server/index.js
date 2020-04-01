const { Pile } = require("../../model");
const postData = require("../../config/postData");
module.exports = { server };

async function server({ client, allocations, allocation, searchTerms }) {
  try {
    let response;
    if (searchTerms) {
      response = await getSearch(client, searchTerms);
    } else if (client === "bbh") {
      response = await Pile["sports"].querySports("basketball");
    } else if (client === "noisefree") {
      response = await Pile["noisefree"].queryNoisefree();
    } else if (allocation) {
      response = await getAllocation(client, allocation);
    } else if (allocations) {
      response = await getCategory(client, allocations);
    } else {
      console.log("in getSelection");
      response = await getSelection(client);
    }
    // console.log({ response });
    return response;
  } catch (e) {
    console.log({ e });
    return;
  }
}

async function getSearch(client, searchTerms) {
  console.log("triggered getSearch");
  return await Pile[client].search(searchTerms, 12);
}

async function getCategory(client, allocations) {
  console.log("triggered getCategory");
  // const {structure} = await getStructure()
  // const allocations = structure[category]
  return await Pile[client].queryCategory(allocations, 3);
}

async function getAllocation(client, allocation) {
  console.log("triggered getAllocation");
  return await Pile[client].queryAllocation(allocation, 12);
}

async function getSelection(client) {
  console.log("triggered getSelection");
  console.log({ client });
  const categories = allCategories[client];
  const limit = limits[client];
  return await Pile[client].querySelection(categories, limit);
}

async function getStructure() {
  const config = {
    target: "librarian",
    mins: 1,
    trigger: "server",
    data: {
      // structure: true
    }
  };
  return await postData(config);
}

const limits = {
  noisefree: 3,
  mimis: 3
};

const allCategories = {
  noisefree: ["technology", "markets", "policy", "potluck"],
  mimis: [
    "americas",
    "europe_and_cis",
    "middle_east_and_africa",
    "asia_and_oceania"
  ]
};
