const db = require("../../models/index");
const BlockedUserNotificationModel = db.block_user_notifications;

module.exports.blockUserNotification = async (request, response) => {
  try {
    const { body } = request;
    const user = await BlockedUserNotificationModel.create(body);

    response.status(200).json("User Notification Has been Blocked");
  } catch {
    response.status(500).json("Some Error Occured");
  }
};
module.exports.unBlockUserNotification = async (request, response) => {
  try {
    const { body } = request;
    const user = await BlockedUserNotificationModel.destroy({
      where: {
        userId: body?.userId,
        blockedUserId: body?.blockedUserId,
      },
    });
    response.status(200).json("User Notification Has been UnBlocked");
  } catch {
    response.status(500).json("Some Error Occured");
  }
};
