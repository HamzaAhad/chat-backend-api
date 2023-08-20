const db = require("../../models/index");
const UserModel = db.users;
const FriendRequestModel = db.friend_requests;
const { Op } = require("sequelize");

module.exports.get = async (request, response) => {
  try {
    const {
      params: { id },
    } = request;

    const user = await UserModel.findOne({
      where: {
        id,
      },
    });
    if (!user) {
      response.status(404).json("User Not Found");
    }

    const data = await FriendRequestModel.findAll({
 	 where: {
   		 [Op.or]: [
     			 { senderId: id },
      			{ receiverId: id },
    			],
    	status: "accepted",
  	},
  	order: [["createdAt", "DESC"]],
	});

    const ids = []
    const roomIds = {}
    for(const item of data){
        const req = { ...item.get() };
	console.log(req,id);  
	if(req?.senderId == id){
              ids.push(req?.receiverId);
              roomIds[req.receiverId] = req?.roomId          }
          if(req?.receiverId == id){
             ids.push(req.senderId);
              roomIds[req.senderId] = req?.roomId
          }
    }
    console.log(ids);
    const users = await UserModel.findAll({
  	where: {

   	 id: {
      	[Op.in]: ids,
    	},
  	},
    });
   const item = []
   console.log(roomIds,'roomIds');
   for (const user of users){
	const val = { ...user.get() }
	item.push({id:val?.id,username:val?.username,playerId:val?.playerId,roomId:roomIds[val?.id]});
   }
    response.status(200).json(item);
  } catch {
    response.status(500).json("Some Error Occured");
  }
};

