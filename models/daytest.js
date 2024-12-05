'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class DayTest extends Model {
    static associate(models) {
      DayTest.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    }
  }
  DayTest.init(
    {
      date: { type: DataTypes.DATEONLY, allowNull: false },
      testResults: { type: DataTypes.JSON, allowNull: false },
      notes: { type: DataTypes.TEXT },
      user_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } }
    },
    { sequelize, modelName: 'DayTest', tableName: 'day_tests', underscored: true }
  );
  return DayTest;
};
