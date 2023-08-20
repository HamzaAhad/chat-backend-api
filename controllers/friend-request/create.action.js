const db = require("../../models/index");
const { Op } = require("sequelize");
const UserModel = db.users;
const FriendRequestModel = db.friend_requests;

module.exports.create = async (request, response) => {
  try {
    let {
      body: { senderId, receiverIds },
    } = request;
    console.log(senderId,receiverIds,"create");
    receiverIds = JSON.parse(receiverIds);
    console.log(senderId,receiverIds);
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
    const uniqDate = Date.now().toString();

   console.log(sender,receivers);
    const body = receivers?.map((receiver) => {
      const itemReceiver = { ...receiver.get() };
      const itemSender = { ...sender.get() };
      console.log(sender, receiver, itemReceiver, itemSender);
      return {
        senderId: itemSender?.id,
        receiverId: itemReceiver?.id,
        senderName: itemSender?.username,
        status: "sent",
        roomId: uniqDate,
      };
    });
    console.log(body);
    const data = await FriendRequestModel.bulkCreate(body);

    response.status(200).json("Send request has been sent successfully");
  } catch(error) {
    console.log(error)
    response.status(500).json("Some Error Occured");
  }
};

