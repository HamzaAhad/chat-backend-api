'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class deleted_messages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  deleted_messages.init({
    userId: DataTypes.INTEGER,
    roomId: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'deleted_messages',
  });
  return deleted_messages;
};