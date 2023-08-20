"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class trackmessages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  trackmessages.init(
    {
      roomId: DataTypes.BIGINT,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "track_messages",
    }
  );
  return trackmessages;
};
