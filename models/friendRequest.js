"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class FriendRequests extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  FriendRequests.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      senderName: {
        type: DataTypes.STRING,
      },
      senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      receiverId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("sent", "accepted", "rejected", "deleted"),
      },
      roomId: {
      type : DataTypes.STRING,   
},
    },
    {
      sequelize,
      modelName: "friend_requests",
    }
  );
  return FriendRequests;
};
