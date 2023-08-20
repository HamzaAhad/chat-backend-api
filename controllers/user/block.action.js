const db = require("../../models/index");
const BlockedUserModel = db.blocked_users;
const UserModel = db.users;

module.exports.blockUsers = async (request, response) => {
  try {
    const { body } = request;
    // eslint-disable-next-line
    console.log("body", body, body.userId, body.blockedUserId);
    const user = await BlockedUserModel.create(body);
    console.log(user);
    response.status(200).json("User Has been Blocked");
  } catch (error) {
    console.log(error);
    response.status(500).json("Some Error Occured");
  }
};

module.exports.unBlockUser = async (request, response) => {
  try {
    const { body } = request;

    const user = await BlockedUserModel.destroy({
      where: {
        userId: body?.userId,
        blockedUserId: body?.blockedUserId,
      },
    });
    console.log(user);
    response.status(200).json("User Has been UnBlocked");
  } catch (error) {
    console.log(error);
    response.status(500).json("Some Error Occured");
  }
};
