
const db = require("../../models/index");
const UserModel = db.users;
const FriendRequestModel = db.friend_requests;

module.exports.accept = async (request, response) => {
  try {
    const {
      body: { senderId, receiverId },
    } = request;
    console.log("id", senderId, receiverId);
    const req = await FriendRequestModel.findOne({
      where: {
        id: [senderId, receiverId],
      },
    });
    console.log(req);
    if (!req) {
      response.status(404).json("User Not Found");
    }

    const data = await FriendRequestModel.update(
      {
        status: "accepted",
      },
      {
        where: { senderId, receiverId },
      }
    );

    response.status(200).json("Send request have been accepted");
  } catch (error) {
    console.log(error);
    response.status(500).json("Some Error Occured");
  }
};

module.exports.reject = async (request, response) => {
  try {
    const {
      body: { senderId, receiverId },
    } = request;
    console.log("id", senderId, receiverId);
    const req = await FriendRequestModel.findOne({
      where: {
        id: [senderId, receiverId],
      },
    });
    console.log(req);
    if (!req) {
      response.status(404).json("User Not Found");
    }

    const data = await FriendRequestModel.update(
      {
        status: "rejected",
      },
      {
        where: { senderId, receiverId },
      }
    );

    response.status(200).json("Send request have been rejected");
  } catch (error) {
    console.log(error);
    response.status(500).json("Some Error Occured");
  }
};
