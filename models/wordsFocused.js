'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class WordsFocused extends Model {
    static associate(models) {
      WordsFocused.belongsTo(models.Metadata, { foreignKey: 'metadata_id', as: 'metadata' });
    }
  }
  WordsFocused.init(
    {
      word: { type: DataTypes.STRING, allowNull: false },
      meaning: { type: DataTypes.STRING, allowNull: false },
      remembered: { type: DataTypes.BOOLEAN, defaultValue: false },
      metadata_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'metadata', key: 'id' } }
    },
    { sequelize, modelName: 'WordsFocused', tableName: 'words_focused', underscored: true }
  );
  return WordsFocused;
};
