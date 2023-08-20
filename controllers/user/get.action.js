
const db = require("../../models/index");
const UserModel = db.users;
const { Op } = require("sequelize");
const FriendRequestModel = db.friend_requests;
module.exports.get = async (request, response) => {
  try {
    console.log(request?.params?.id)
    const users = await UserModel.findAll({
     where:{ id: { [Op.ne] : request?.params?.id } }
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
  
    const ids = []
    for(const item of data){
        const req = { ...item.get() };
        console.log(req);  
        if(req?.senderId == request.params.id){
              ids.push(req?.receiverId);
              }
      if(req?.receiverId == request.params.id){
             ids.push(req.senderId);
              
          }
    }
    console.log(ids,'ids');
   
    const items = []
    for (const user of users){
       const val = { ...user.get() }
       console.log(val?.id in ids,ids.indexOf(val?.id))
       if (ids.indexOf(val?.id) !== -1){
	console.log("none",val?.id)
	}
	else{
	console.log('exist',val?.id)
	items.push(val)
        }
    }
   
    response.status(200).json(items);
  } catch(error) {
    console.log(error,'error')
    response.status(500).json('some error occured');
  }
};
