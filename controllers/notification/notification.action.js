const db = require("../../models/index");
const OneSignal = require("onesignal-node");
const axios = require("axios");
const UserModel = db.users;
const BlockedUserNotificationModel = db.block_user_notifications;
const BlockedUserModel = db.blocked_users;

const { Op } = require("sequelize");
// Initialize OneSignal client
module.exports.sendNotification = async (request, response) => {
  try {
    let { roomId, senderId, userIds, title, message, notificationType } =
      request.body;

    userIds = JSON.parse(userIds);

    const blockedNotification = await BlockedUserNotificationModel.findAll({
      where: {
        blockedUserId: senderId,
        userId: { [Op.in]: userIds },
      },
    });
    if (blockedNotification?.length) {
      for (let item of blockedNotification) {
        item = { ...item.get() };
        let id = item?.userId;
        let indexToRemove = userIds.indexOf(id);
        if (indexToRemove !== -1) {
          userIds.splice(indexToRemove, 1);
        }
      }
    }
    const blockedUser = await BlockedUserModel.findAll({
      where: {
        blockedUserId: senderId,
        userId: { [Op.in]: userIds },
      },
    });
    if (blockedUser?.length) {
      for (let item of blockedUser) {
        item = { ...item.get() };
        let id = item?.userId;
        let indexToRemove = userIds.indexOf(id);
        if (indexToRemove !== -1) {
          userIds.splice(indexToRemove, 1);
        }
      }
    }

    const users = await UserModel.findAll({
      where: { id: { [Op.in]: [...userIds, senderId] } },
    });

    let senderUsername = "";
    const members = [];
    const include_player_ids = [];
    for (let user of users) {
      user = { ...user.get() };
      if (senderId == user?.id) {
        senderUsername = user?.username;
      } else {
        include_player_ids.push(user.playerId);
        members.push({
          memberId: user?.id,
          memberName: user?.username,
        });
      }
    }

    const notification = {
      app_id: "6bcbc7b7-d1f2-406b-8ff5-87c2b2902c2a",
      contents: { en: message },
      headings: { en: title },
      included_segments: ["include_player_ids"],
      include_player_ids: include_player_ids,
      content_avaliable: true,
      small_icon: "ic_notification_icon",
      data: {
        PushTitle: message,
        notificationType: notificationType,
        roomId,
        members,
        senderId,
        senderUsername,
        isGroup: request?.body?.isGroup,
      },
    };
    // Set the OneSignal API endpoint URL
    const url = "https://onesignal.com/api/v1/notifications";

    // Set the OneSignal REST API key in the headers
    const headers = {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: "Basic N2EyOTRlZDQtZjNiMy00MWMwLTg1MDktMGZhODRiZmI4MTM5",
    };

    let data = "";
    // Make the POST request to the OneSignal API
    axios
      .post(url, notification, { headers })
      .then((response) => {
        console.log("Notification sent successfully!");
        data = response?.data;
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error sending notification:", error.message);
      });

    // const sendMessage = send(notification);
    response.status(200).json("Notification Sent");
  } catch (error) {
    console.log(error, "error");
    response.status(500).json("Some Error Occured");
  }
};
