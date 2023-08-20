const { sendNotification } = require("./notification.action.js");

module.exports = {
  "/": {
    post: {
      action: sendNotification,
      level: "public",
    },
  },
};
