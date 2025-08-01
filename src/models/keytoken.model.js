'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../dbs/init_mariadb');

const KeyToken = sequelize.define('KeyToken', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.STRING(24),
    allowNull: false,
    references: {
      model: 'users', 
      key: 'id'
    },
    field: 'user' 
  },
  privateKey: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  refeshTokensUsed: {
    type: DataTypes.JSON, 
    allowNull: false,
    defaultValue: []
  }
}, {
  tableName: 'keytokens',
  timestamps: true
});

module.exports = KeyToken;
