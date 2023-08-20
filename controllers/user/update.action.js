const db = require("../../models/index");
const UserModel = db.users;

module.exports.update = async (request, response) => {
  try {
    const {
      params: { id },
      body: { removeAllAfter },
    } = request;
    await UserModel.update(
      {
        removeAllAfter,
      },
      {
        where: { id },
      }
    );

    response.status(200).json("Updated");
  } catch {
    response.status(500).json("Some Error Occured");
  }
};
