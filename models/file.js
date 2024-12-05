'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class File extends Model {
    static associate(models) {
      File.belongsTo(models.Folder, { foreignKey: 'folder_id', as: 'folder' });
      File.hasOne(models.Metadata, { foreignKey: 'file_id', as: 'metadata' });
    }
  }
  File.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      content: { type: DataTypes.TEXT, allowNull: false },
      folder_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'folders', key: 'id' } }
    },
    { sequelize, modelName: 'File', tableName: 'files', underscored: true }
  );
  return File;
};
