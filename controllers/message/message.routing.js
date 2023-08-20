const { getMessage, sendMessage } = require("./message.action.js");

module.exports = {
  "/": {
    get: {
      action: getMessage,
      level: "public",
    },
    post: {
      action: sendMessage,
      level: "public",
    },
  },
};
