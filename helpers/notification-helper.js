const db = require("../models/index");
const OneSignal = require("onesignal-node");
const axios = require("axios");
const UserModel = db.users;
const TrackMessageModel = db.track_messages;
const FriendRequestModel = db.friend_requests;
const UserGroupModel = db.user_group_associations;
const BlockedUserNotificationModel = db.block_user_notifications;
const BlockedUserModel = db.blocked_users;

const { Op } = require("sequelize");

// Initialize OneSignal client
module.exports.sendNotification = async (content) => {
  try {
    const { userId, username, roomId, isGroup, groupName, isBroadcast } =
      JSON.parse(content);
    let data = [];
    if (parseInt(userId) && parseInt(roomId)) {
      if (parseInt(isGroup)) {
        data = await UserGroupModel.findAll({
          where: {
            groupId: roomId,
            memberId: { [Op.ne]: userId },
          },
        });
      } else {
        data = await FriendRequestModel.findAll({
          where: {
            [Op.or]: [{ senderId: userId }, { receiverId: userId }],
            roomId: roomId,
            status: "accepted",
          },
        });
      }
    }

    const userIds = [];
    for (let item of data) {
      item = { ...item?.get() };
      if (parseInt(isGroup)) {
        userIds.push(item?.memberId);
      } else {
        if (userId == item?.receiverId) {
          userIds.push(item?.senderId);
        }
        if (userId == item?.senderId) {
          userIds.push(item?.receiverId);
        }
      }
    }


    const blockedNotification = await BlockedUserNotificationModel.findAll({
      where: {
        blockedUserId: userId,
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
        blockedUserId: userId,
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
    const presentUsers = await TrackMessageModel.findAll({
      where: {
        roomId: roomId,
        userId: { [Op.ne]: userId },
      },
    });

    if (presentUsers?.length) {
      for (let item of presentUsers) {
        item = { ...item.get() };

        let id = item?.userId;

        let indexToRemove = userIds.indexOf(id);
        if (indexToRemove !== -1) {
          userIds.splice(indexToRemove, 1);
        }
      }
    }

    const users = await UserModel.findAll({
      where: { id: { [Op.in]: [...userIds, userId] } },
    });

    let senderUsername = "";
    const members = [];
    const include_player_ids = [];
    for (let user of users) {
      user = { ...user.get() };
      if (userId == user?.id) {
        senderUsername = user?.username;
      } else {
        include_player_ids.push(user.playerId);
        members.push({
          memberId: user?.id,
          memberName: user?.username,
        });
      }
    }

    let notificationMessage = "";

    if (parseInt(isGroup)) {
      notificationMessage = `${username} have sent a message to group ${groupName}`;
    } else {
      notificationMessage = `${username} have sent you a message `;
    }
    if (isBroadcast) {
      notificationMessage = `${username} have sent you a broadcast message `;
    }

    const notification = {
      app_id: "6bcbc7b7-d1f2-406b-8ff5-87c2b2902c2a",
      contents: { en: notificationMessage },

      headings: { en: "New message" },
      included_segments: ["include_player_ids"],
      include_player_ids: include_player_ids,
      content_avaliable: true,
      small_icon: "ic_notification_icon",
      data: {
        PushTitle: notificationMessage,
        notificationType: "message",
        roomId,
        members,
        senderId: userId,
        senderUsername,
        isGroup,
        groupName,
      },
    };
    // Set the OneSignal API endpoint URL
    const url = "https://onesignal.com/api/v1/notifications";

    // Set the OneSignal REST API key in the headers
    const headers = {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: "Basic N2EyOTRlZDQtZjNiMy00MWMwLTg1MDktMGZhODRiZmI4MTM5",
    };

    // Make the POST request to the OneSignal API
    axios
      .post(url, notification, { headers })
      .then((response) => {
        console.log("Notification sent successfully!");
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error sending notification:", error.message);
      });

    return true;

    // const sendMessage = send(notification);
  } catch (error) {
    console.log(error, "error");
    return false;
  }
};
