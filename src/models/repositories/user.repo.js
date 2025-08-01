'use strict';

const AppSeleted = require("../../enum/app_selected.enum");
const { Op } = require('sequelize');
const { ObjectId } = require('bson');
const {
  getSelectData,
  unGetSelectData,
  formatPaginatonPayload,
} = require('../../utils');

const UserModel = require('../user.model');

// Tìm user theo username
const findUserByUsername = async ({username, raw = true}) => {

  return await UserModel.scope(null).findOne({
    where: { username },
    raw: raw,
  });
};

// Tìm user theo ID (string dạng UUID/ObjectId)
const findUserByIdLean = async (userId) => {
  return await UserModel.scope(null).findByPk(userId, { raw: true });
};

// Tạo user mới
const createUser = async (data) => {
  return await UserModel.create({
    id: new ObjectId().toHexString(),
    ...data
  });
};

// Tìm chi tiết user + thông tin updatedBy (join user)
const findUserDetaiById = async (
  userId,
  unSelected = ['requried_change_pass', 'user_salt', 'password', 'updatedBy', ]
) => {
  const attributes = unGetSelectData(unSelected);

  return await UserModel.findByPk(userId, {
    attributes,
    raw: true,
    nest: true,
  });
};

module.exports = {
  findUserByUsername,
  createUser,
  findUserDetaiById,
};
