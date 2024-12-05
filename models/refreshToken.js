const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const RefreshToken = sequelize.define('RefreshToken', {
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  // Define the association in the model
  RefreshToken.associate = (models) => {
    RefreshToken.belongsTo(models.User, {
      foreignKey: 'userId', // Define the foreign key in the RefreshToken table
      as: 'user', // Alias for the relationship
      onDelete: 'CASCADE', // Optional: cascade delete tokens if the user is deleted
    });
  };

  return RefreshToken;
};
