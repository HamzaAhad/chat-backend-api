"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Users.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: DataTypes.STRING,
      playerId: DataTypes.STRING,
      loggedInAt: DataTypes.DATE,
      removeAllAfter: {
        type: DataTypes.INTEGER,
        defaultValue: 10,
      },
      clientId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "users",
    }
  );
  return Users;
};
