const db = require("../../models/index");
const { Op } = require("sequelize");
const UserModel = db.users;
const FriendRequestModel = db.friend_requests;

module.exports.deleteUsers = async (request, response) => {
  try {
    let { body } = request;
    console.log("body", body);

    console.log(body);
    const data = await FriendRequestModel.update(
      { status: "deleted" },
      {
        where: {
          senderId: {
            [Op.in]: [body?.senderId, body?.receiverId],
          },
          receiverId: {
            [Op.in]: [body?.senderId, body?.receiverId],
          },
        },
      }
    );

    response.status(200).json("User has been deleted successfully");
  } catch (error) {
    console.log(error);
    response.status(500).json("Some Error Occured");
  }
};
