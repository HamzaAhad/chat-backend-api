// models
const db = require("../models/index");
const MessageModel = db.messages;
const DeleteMessageModel = db.deleted_messages;
module.exports.storeMessage = async (roomId, userId, content) => {
  try {
    const text = JSON.parse(content);
    const value = text?.message;
    const recordExists = await MessageModel.findOne({
      where: {
        roomId: roomId,
        userId: userId,
      },
    });
    if (!recordExists) {
      await MessageModel.create({
        message: value,
        roomId,
        userId,
      });
    } else {
      await MessageModel.update(
        {
          message: value,
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
      where: { roomId: roomId, userId: userId },
    });
  } catch (error) {
    // Handle errors here
    console.error("Error:", error);
  }
};
