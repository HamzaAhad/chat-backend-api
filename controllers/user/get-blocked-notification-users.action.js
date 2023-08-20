const db = require("../../models/index");
const BlockedUserNotificationModel = db.block_user_notifications;

module.exports.getBlockedNotificationUsers = async (request, response) => {
  try {
    const {
      params: { id },
    } = request;
    const blockedUsers = await BlockedUserNotificationModel.findAll({
      where: {
        userId: id,
      },
      attributes: ["blockedUserId"],
    });

    const userArray = blockedUsers?.map((user) => {
      return user?.blockedUserId;
    });

    response.status(200).json(userArray);
  } catch {
    response.status(500).json("Some Error Occured");
  }
};
