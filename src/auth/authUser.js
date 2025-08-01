"use strict";
const {
  AuthFailureError,
  BadRequestError,
  ForbiddenError,
} = require("../core/error.response");

const asyncHandler = require("../helpers/asyncHandler");
const ErrorMessage = require("../enum/error.message");

const UserService = require("../services/user.service");

const isCurrentUser = () => {
  return asyncHandler(async (req, res, next) => {
    const userId = req.user.userId;
    const foundUser = await UserService.findUserByIdLean(userId);
    if (!foundUser) {
      return next(new BadRequestError(ErrorMessage.USER_NOT_FOUND));
    }
    req.currentUserInfo = foundUser;
    return next();
  });
};

module.exports = {
  isCurrentUser: isCurrentUser,
};
