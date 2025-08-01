'use strict';
const { DataTypes } = require('sequelize');
const { v4: uuid } = require('uuid');
const sequelize = require('../dbs/init_mariadb');

const OAuthAccessToken = sequelize.define('OAuthAccessToken', {
  id: {
    type: DataTypes.STRING(36),
    primaryKey: true,
    allowNull: false
  },
  accessToken: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  accessTokenExpiresAt: {
    type: DataTypes.DATE
  },
  scope: {
    type: DataTypes.STRING
  },
  clientId: {
    type: DataTypes.STRING
  },
  userId: {
    type: DataTypes.STRING(24)
  }
}, {
  tableName: 'oauth_access_tokens',
  timestamps: true,
  hooks: {
    beforeCreate: (token) => {
      if (!token.id) {
        token.id = uuid();
      }
    }
  }
});

module.exports = OAuthAccessToken;
