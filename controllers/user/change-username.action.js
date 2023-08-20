const db = require("../../models/index");
const { Op } = require("sequelize");
const UserModel = db.users;

module.exports.changeUsername = async (request, response) => {
  const {
    params: { id },
    body: { username },
  } = request;
  try {
    const user = await UserModel.findAll({
      where: {
        id: { [Op.ne]: id },
        username: username,
      },
    });

    console.log(user);
    if (user.length) {
      response.status(403).json("Username already exists");
    }
    if (!user.length){
    const data = await UserModel.update(
      { username },
      {
        where: {
          id,
        },
      }
    );
   }
    response.status(200).json("Updated");
  } catch {
    response.status(500).json("Some Error Occured");
  }
};
