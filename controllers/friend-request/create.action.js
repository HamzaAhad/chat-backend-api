const db = require("../../models/index");
const { Op } = require("sequelize");
const UserModel = db.users;
const FriendRequestModel = db.friend_requests;

module.exports.create = async (request, response) => {
  try {
    let {
      body: { senderId, receiverIds },
    } = request;
    receiverIds = JSON.parse(receiverIds);
    const receivers = await UserModel.findAll({
      where: {
        id: { [Op.in]: receiverIds },
      },
    });

    const sender = await UserModel.findOne({
      where: {
        id: senderId,
      },
    });

    if (!receivers || !sender) {
      response.status(404).json("User Not Found");
    }

    let count = 1;
    const body = receivers?.map((receiver) => {
      const itemReceiver = { ...receiver.get() };
      const itemSender = { ...sender.get() };
      const uniqDate = `${count}${Date.now().toString()}`;
      count += 1;
      return {
        senderId: itemSender?.id,
        receiverId: itemReceiver?.id,
        senderName: itemSender?.username,
        status: "sent",
        roomId: uniqDate,
      };
    });

    const data = await FriendRequestModel.bulkCreate(body);

    response.status(200).json("Send request has been sent successfully");
  } catch (error) {
    console.log(error);
    response.status(500).json("Some Error Occured");
  }
};
