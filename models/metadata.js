'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Metadata extends Model {
    static associate(models) {
      Metadata.belongsTo(models.File, { foreignKey: 'file_id', as: 'file' });
      Metadata.hasMany(models.WordsFocused, { foreignKey: 'metadata_id', as: 'wordsFocused' });
      Metadata.hasMany(models.SkillsPerformance, { foreignKey: 'metadata_id', as: 'skillsPerformance' });
    }
  }
  Metadata.init(
    {
      subject: { type: DataTypes.STRING, allowNull: false },
      level: { type: DataTypes.STRING },
      timePassed: { type: DataTypes.INTEGER },
      notes: { type: DataTypes.TEXT },
      file_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'files', key: 'id' } }
    },
    { sequelize, modelName: 'Metadata', tableName: 'metadata', underscored: true }
  );
  return Metadata;
};
