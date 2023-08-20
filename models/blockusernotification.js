"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class blockUserNotification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  blockUserNotification.init(
    {
      userId: DataTypes.INTEGER,
      blockedUserId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "block_user_notifications",
    }
  );
  return blockUserNotification;
};
