const db = require("../../models/index");
const UserModel = db.users;
const { Op } = require("sequelize");
const FriendRequestModel = db.friend_requests;
module.exports.get = async (request, response) => {
  try {
    const users = await UserModel.findAll({
      where: { id: { [Op.ne]: request?.params?.id } },
    });

    const data = await FriendRequestModel.findAll({
      where: {
        [Op.or]: [
          { senderId: request?.params?.id },
          { receiverId: request?.params?.id },
        ],
        status: { [Op.in]: ["accepted", "sent"] },
      },
      order: [["createdAt", "DESC"]],
    });

    const ids = [];
    for (const item of data) {
      const req = { ...item.get() };
      if (req?.senderId == request.params.id) {
        ids.push(req?.receiverId);
      }
      if (req?.receiverId == request.params.id) {
        ids.push(req.senderId);
      }
    }

    const items = [];
    for (const user of users) {
      const val = { ...user.get() };
      if (ids.indexOf(val?.id) !== -1) {
      } else {
        items.push(val);
      }
    }

    response.status(200).json(items);
  } catch (error) {
    console.log(error, "error");
    response.status(500).json("some error occured");
  }
};
