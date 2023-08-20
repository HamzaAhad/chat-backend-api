const db = require("../../models/index");
const MessageModel = db.messages;
const DeleteMessageModel = db.deleted_messages;
const UserGroupAssociationModel = db.user_group_associations;

module.exports.deleteMessage = async (request, response) => {
  try {
    const { body } = request;
    if (body?.roomId) {
      await DeleteMessageModel.create(body);

      const isGroup = await UserGroupAssociationModel.findOne({
        where: {
          groupId: body?.roomId,
          memberId: body?.userId,
        },
      });
      if (isGroup) {
        await UserGroupAssociationModel.destroy({
          where: {
            groupId: body?.roomId,
            memberId: body?.userId,
          },
        });
      }
    } else {
      const messages = await MessageModel.findAll({
        where: {
          userId: body?.userId,
        },
      });

      const data = [];
      for (let item of messages) {
        item = { ...item?.get() };

        data.push({
          userId: body?.userId,
          roomId: item?.roomId,
        });
      }

      await DeleteMessageModel.bulkCreate(data);
    }
    response.status(200).json("Messages Have Been Deleted");
  } catch (error) {
    console.log(error);
    response.status(500).json("Some Error Occured");
  }
};
