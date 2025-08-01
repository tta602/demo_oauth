'use strict';
const { DataTypes } = require('sequelize');
const { v4: uuid } = require('uuid');
const sequelize = require('../dbs/init_mariadb');

const OAuthClient = sequelize.define('OAuthClient', {
  id: {
    type: DataTypes.STRING(36),
    primaryKey: true,
    allowNull: false
  },
  userId: {
    type: DataTypes.STRING(24),
    allowNull: true
  },
  clientId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  clientSecret: {
    type: DataTypes.STRING,
    allowNull: false
  },
  callbackUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  grants: {
    type: DataTypes.JSON,
    allowNull: false
  }
}, {
  tableName: 'oauth_clients',
  timestamps: true,
  hooks: {
    beforeCreate: (client) => {
      if (!client.id) {
        client.id = uuid();
      }
    }
  }
});

module.exports = OAuthClient;
