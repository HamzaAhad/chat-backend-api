const cron = require("node-cron");
const { Op } = require("sequelize");
const db = require("./models/index");
const dayjs = require("dayjs");
const UserModel = db.users;
const BlockedUserModel = db.blocked_users;
const FriendRequestModel = db.friend_requests;
const UserGroupModel = db.user_group_associations;
const BlockedUserNotificationModel = db.block_user_notifications;
// Schedule a task to run every day at midnight (00:00)
const task = cron.schedule(
  "* * * * *",
  async () => {
    // Your task code goes here
    console.log("Cron job running every 1 min.");
    const currentDate = dayjs();
    const users = await UserModel.findAll({});

    const userIds = [];
    for (let user of users) {
      user = { ...user.get() };
      const differenceInDays = currentDate.diff(dayjs(user.loggedInAt), "day");
      console.log(differenceInDays, user.id);
      if (differenceInDays > user.removeAllAfter) {
        userIds.push(user?.id);
      }
    }

    const usergroup = await UserGroupModel.destroy({
      where: {
        memberId: { [Op.in]: userIds },
      },
    });

    const req = await FriendRequestModel.destroy({
      where: {
        [Op.or]: [
          { senderId: { [Op.in]: userIds } },
          { receiverId: { [Op.in]: userIds } },
        ],
      },
    });
    const blockuser = await BlockedUserModel.destroy({
      where: {
        [Op.or]: [
          { userId: { [Op.in]: userIds } },
          { blockedUserId: { [Op.in]: userIds } },
        ],
      },
    });
    const blocknotification = await BlockedUserNotificationModel.destroy({
      where: {
        [Op.or]: [
          { userId: { [Op.in]: userIds } },
          { blockedUserId: { [Op.in]: userIds } },
        ],
      },
    });

    const user = await UserModel.destroy({
      where: {
        id: { [Op.in]: userIds },
      },
    });

    // Your task code goes here
    console.log(
      "Cron job running on min.",
      userIds,
      usergroup,
      req,
      blocknotification,
      blockuser,
      user
    );
  },
  {
    scheduled: true,
  }
);

console.log("inside console file");
// Start the cron job
task.start();
