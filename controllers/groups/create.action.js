const db = require("../../models/index");
const GroupModel = db.groups;
const UserModel = db.users;
const { Op } = require("sequelize");
const UserGroupAssociationModel = db.user_group_associations;
module.exports.create = async (request, response) => {
  try {
    let {
      body: { groupName, memberIds },
    } = request;

    const group = await GroupModel.create({
      groupName,
    });

    memberIds = JSON.parse(memberIds);
    const users = await UserModel.findAll({
      where: {
        id: { [Op.in]: memberIds },
      },
    });

    const data = [];
    for (const user of users) {
      data.push({
        groupId: group?.id,
        memberId: user?.id,
        groupName: group?.groupName,
        memberName: user?.username,
      });
    }

    await UserGroupAssociationModel.bulkCreate(data);

    response.status(200).json("Groups has been created successfully");
  } catch (error) {
    console.log(error);
    response.status(500).json("Some Error Occured");
  }
};
