const { get } = require("./get.action.js");
const { create } = require("./create.action.js");
const { disassociate } = require("./disassociate.action");

module.exports = {
  "/:id": {
    get: {
      action: get,
      level: "public",
    },
    post: {
      action: create,
      level: "public",
    },
  },
  "/disassociate": {
    post: {
      action: disassociate,
      level: "public",
    },
  },
};
