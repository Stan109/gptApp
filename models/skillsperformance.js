'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SkillsPerformance extends Model {
    static associate(models) {
      SkillsPerformance.belongsTo(models.Metadata, { foreignKey: 'metadata_id', as: 'metadata' });
    }
  }
  SkillsPerformance.init(
    {
      skill: { type: DataTypes.STRING, allowNull: false },
      performance: { type: DataTypes.ENUM('Poor', 'Average', 'Good'), allowNull: false },
      metadata_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'metadata', key: 'id' } }
    },
    { sequelize, modelName: 'SkillsPerformance', tableName: 'skills_performance', underscored: true }
  );
  return SkillsPerformance;
};
