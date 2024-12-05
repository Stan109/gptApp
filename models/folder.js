'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Folder extends Model {
    static associate(models) {
      Folder.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
      Folder.hasMany(models.File, { foreignKey: 'folder_id', as: 'files' });
    }
  }
  Folder.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      user_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } }
    },
    { sequelize, modelName: 'Folder', tableName: 'folders', underscored: true }
  );
  return Folder;
};
