const db = require("../../models/index");
const BlockedUserModel = db.blocked_users;

module.exports.getBlockedUsers = async (request, response) => {
  try {
    const {
      params: { id },
    } = request;
    const blockedUsers = await BlockedUserModel.findAll({
      where: {
        userId: id,
      },
      attributes: ["blockedUserId"],
    });

    const userArray = blockedUsers?.map((user) => {
      return user?.blockedUserId;
    });

    response.status(200).json(userArray);
  } catch {
    response.status(500).json("Some Error Occured");
  }
};
