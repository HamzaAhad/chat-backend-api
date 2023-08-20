const { Op } = require("sequelize");
// models
const db = require("../models/index");
const UserModel = db.users;
const MessageModel = db.messages;
const DeleteMessageModel = db.deleted_messages;
module.exports.getMessage = async (roomId, userId) => {
  try {
    const deletedUsers = await DeleteMessageModel.findAll({
      where: { roomId: roomId },
    });
    const deletedIds = [];
    for (let item of deletedUsers) {
      item = { ...item?.get() };
      deletedIds.push(item?.userId);
    }
    if (deletedIds?.includes(userId)) {
      return [];
    } else {
      const messages = await MessageModel.findAll({
        where: {
          roomId,
          userId: { [Op.ne]: userId },
        },
      });

      const userIds = [];
      for (let message of messages) {
        message = { ...message.get() };
        userIds.push(message?.userId);
      }

      const users = await UserModel.findAll({
        where: {
          id: { [Op.in]: userIds },
        },
      });

      const arr = [];
      for (let message of messages) {
        message = { ...message.get() };
        for (let user of users) {
          user = { ...user.get() };
          if (user?.id == message?.userId) {
            const alreadyExist = arr.find(
              (obj) => obj?.username == user?.username
            );
            if (!alreadyExist) {
              arr.push({
                username: user?.username,
                message: message?.message,
              });
            }
          }
        }
      }
      // Handle the updated or newly created record here
      console.log("Get Record:", arr);
      return arr;
    }
  } catch (error) {
    // Handle errors here
    console.error("Error:", error);
  }
};
