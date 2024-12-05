'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Folder, { foreignKey: 'userId', as: 'folders' });
      User.hasMany(models.DayTest, { foreignKey: 'userId', as: 'dayTests' });
      User.hasMany(models.RefreshToken, { foreignKey: 'userId', as: 'refreshTokens' });
    }
  }
  User.init(
    {
      username: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
      role: { type: DataTypes.STRING, defaultValue: 'user' },
      createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    },
    { sequelize, modelName: 'User', tableName: 'users', underscored: true }
  );
  return User;
};
