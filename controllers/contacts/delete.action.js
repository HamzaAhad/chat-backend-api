const db = require("../../models/index");
const { Op } = require("sequelize");
const UserModel = db.users;
const FriendRequestModel = db.friend_requests;

module.exports.deleteContact = async (request, response) => {
  try {
    const {
      params: { id },
      body: { deleteUserId },
    } = request;

    const user = await UserModel.findOne({
      where: {
        id: [id, deleteUserId],
      },
    });
    if (!user) {
      response.status(404).json("User Not Found");
    }

    const data = await FriendRequestModel.findAll({
      where: {
        [Op.or]: [
          { [Op.and]: { senderId: id, status: "accepted" } },
          { [Op.and]: { recieverId: id, status: "accepted" } },
        ],
      },
      order: [["createdAt", "DESC"]],
    });

    response.status(200).json(data);
  } catch {
    response.status(500).json("Some Error Occured");
  }
};
