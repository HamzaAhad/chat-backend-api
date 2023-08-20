const db = require("../../models/index");
const UserModel = db.users;
const MessageModel = db.messages;
const { Op } = require("sequelize");
const DeleteMessageModel = db.deleted_messages;
const { sendNotification } = require("../../helpers/notification-helper");
module.exports.sendMessage = async (request, response) => {
  try {
    const message = request?.body;
    const text = message?.message;
    const roomIds = JSON.parse(message?.roomId);
    const userId = parseInt(message?.userId);

    for (let roomId of roomIds) {
      roomId = parseInt(roomId);
      const recordExists = await MessageModel.findOne({
        where: {
          roomId: roomId,
          userId: userId,
        },
      });
      if (!recordExists) {
        await MessageModel.create({
          message: text,
          roomId,
          userId,
        });
      } else {
        await MessageModel.update(
          {
            message: text,
          },
          {
            where: {
              roomId,
              userId,
            },
          }
        );
      }
      const deletedUsers = await DeleteMessageModel.destroy({
        where: { roomId: roomId },
      });
      await sendNotification(
        JSON.stringify({
          userId,
          roomId,
          isGroup: 0,
          username: request?.body?.username,
          isBroadcast: 1,
        })
      );
    }
    response.status(200).json("Send Message Successfully");
  } catch (error) {
    console.log(error);
    response.status(500).json("Some Error Occured");
  }
};

module.exports.getMessage = async (request, response) => {
  try {
    const userId = parseInt(request?.query?.userId);
    const roomId = parseInt(request?.query?.roomId);
    const deletedUsers = await DeleteMessageModel.findAll({
      where: { roomId: roomId },
    });
    const deletedIds = [];
    for (let item of deletedUsers) {
      item = { ...item?.get() };
      deletedIds.push(parseInt(item?.userId));
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
      console.log("Get Record Api:", arr);

      response.status(200).json(arr);
    }
  } catch (error) {
    // Handle errors here
    console.error("Error:", error);
  }
};
