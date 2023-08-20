const { get } = require("./get.action.js");
const { deleteContact } = require("./delete.action.js");

module.exports = {
  "/:id": {
    get: {
      action: get,
      level: "public",
    },
    post: {
      action: deleteContact,
      level: "public",
    },
  },
};
