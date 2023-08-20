const db = require("../../models/index");
const GroupModel = db.groups;
const UserGroupAssociationModel = db.user_group_associations;
module.exports.get = async (request, response) => {
  try {
    const {
      params: { id },
    } = request;

    const groups = await UserGroupAssociationModel.findAll({
      where: {
        memberId: id,
      },
    });

    const groupIds = groups?.map((item) => {
      return item?.groupId;
    });

    const groupData = await UserGroupAssociationModel.findAll({
      where: {
        groupId: groupIds,
      },
    });
    const arr = [];
    for (let group of groupData) {
      group = { ...group.get() };

      const id = group?.groupId;
      const indexToDelete = arr.findIndex((obj) => obj.groupId === id);
      const data = arr[indexToDelete];
      console.log("data", data);
      if (indexToDelete !== -1) {
        arr.splice(indexToDelete, 1);
      }
      if (!data) {
        arr.push({
          groupId: group?.groupId,
          groupName: group?.groupName,
          members: [
            { memberId: group?.memberId, memberName: group?.memberName },
          ],
          createdAt: group?.createdAt,
        });
      } else {
        data.members.push({
          memberId: group?.memberId,
          memberName: group?.memberName,
        });
        arr.push(data);
      }
    }

    response.status(200).json(arr);
  } catch (error) {
    console.log(error);
    response.status(500).json("Some Error Occured");
  }
};
