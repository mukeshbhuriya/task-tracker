const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  const Token = sequelize.define('Token', {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    revoked_at: DataTypes.DATE
  }, {
    tableName: 'tokens',
    timestamps: true
  });
  return Token;
};
