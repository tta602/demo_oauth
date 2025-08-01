'use strict';
const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../dbs/init_mariadb'); 
const { AppStatus } = require('../enum/app.enum'); 
const { ObjectId } = require('bson');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.STRING(24), 
    primaryKey: true,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    trim: true
  },
  fullName: {
    type: DataTypes.STRING,
    trim: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  user_salt: {
    type: DataTypes.STRING
  },
  status: {
    type: DataTypes.ENUM(AppStatus.active, AppStatus.inactive),
    defaultValue: AppStatus.active
  },
  user_address: {
    type: DataTypes.STRING
  },
  time: {
    type: DataTypes.BIGINT,
    defaultValue: () => Date.now()
  },
  requried_change_pass: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  verify: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  updatedBy: {
    type: DataTypes.STRING(24),
    allowNull: true,
    references: {
      model: 'users', // tên bảng, không phải tên model
      key: 'id'
    }
  },
}, {
  tableName: 'users',
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (!user.id) {
        user.id = new ObjectId().toHexString(); 
      }
      if (user.password) {
        const salt = await bcrypt.genSalt(11);
        user.user_salt = salt;
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(11);
        user.user_salt = salt;
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  },
  defaultScope: {
    attributes: { exclude: ['password', 'user_salt'] }
  },
  scopes: {
    withPassword: {
      attributes: {}
    }
  }
});

// Custom instance method
User.prototype.isCheckPassword = async function (inputPassword) {
  try {
    return await bcrypt.compare(inputPassword, this.password);
  } catch (err) {
    return false;
  }
};

module.exports = User;
