const db = require("../../models/index");

const DeleteMessageModel = db.deleted_messages;
const UserGroupAssociationModel = db.user_group_associations;
module.exports.disassociate = async (request, response) => {
  try {
    let {
      body: { userId, roomId },
    } = request;

    await UserGroupAssociationModel.destroy({
      where: {
        groupId: roomId,
        memberId: userId,
      },
    });

    await DeleteMessageModel.create({
      userId,
      roomId,
    });

    response.status(200).json("User has been successfully disassociated");
  } catch (error) {
    console.log(error);
    response.status(500).json("Some Error Occured");
  }
};
