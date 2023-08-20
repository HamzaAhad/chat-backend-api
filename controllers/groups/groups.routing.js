const { get } = require("./get.action.js");
const { create } = require("./create.action.js");

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
};
