const { get } = require("./get.action.js");
const { blockUsers, unBlockUser } = require("./block.action.js");
const { deleteUsers } = require("./delete.action.js");
const { getBlockedUsers } = require("./get-blocked-user.action.js");
const {
  blockUserNotification,
  unBlockUserNotification,
} = require("./block-notification.action.js");
const {
  getBlockedNotificationUsers,
} = require("./get-blocked-notification-users.action.js");
const { changeUsername } = require("./change-username.action.js");
const { update } = require("./update.action.js");
module.exports = {
  "/:id": {
    get: {
      action: get,
      level: "public",
    },
  },
  "/:id/update": {
    put: {
      action: update,
      level: "public",
    },
  },
  "/:id/changeusername": {
    post: {
      action: changeUsername,
      level: "public",
    },
  },
  "/:id/blockuser": {
    get: {
      action: getBlockedUsers,
      level: "public",
    },
    post: {
      action: blockUsers,
      level: "public",
    },
  },
  "/:id/unblockuser": {
    post: {
      action: unBlockUser,
      level: "public",
    },
  },
  "/:id/blocknotification": {
    get: {
      action: getBlockedNotificationUsers,
      level: "public",
    },
    post: {
      action: blockUserNotification,
      level: "public",
    },
  },
  "/:id/unblocknotification": {
    post: {
      action: unBlockUserNotification,
      level: "public",
    },
  },
  "/delete": {
    post: {
      action: deleteUsers,
      level: "public",
    },
  },
};
