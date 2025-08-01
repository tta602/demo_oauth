"use strict";
const ErrorMessage = require("../enum/error.message");
const crypto = require("node:crypto");
const AppConstants = require("../config/constant.app");

const { getInfoData } = require("../utils");
const {
  AppStatus,
} = require("../enum/app.enum");
const {
  createTokenPair,
  createTokenPairForgotPass,
} = require("../auth/authUtils");

const {
  BadRequestError,
  ConflictResponse,
  NotFoundError,
} = require("../core/error.response");

const { applicationLogger } = require("../loggers/mylogger.log");

//repo
const {
  findUserByUsername,
  createUser,
  findUserDetaiById,
} = require("../models/repositories/user.repo");

//services
const KeyTokenService = require("./keyToken.service");

const USER_FILED_RETURN = [
  "id",
  "username",
  "fullName",
  "status",
  "email",
  "phone",
  "status",
  "updatedAt",
];

const LOGIN_FILED_RETURN = [
  "id",
  "username",
  "fullName",
  "status",
  "email",
  "phone",
  "status"
];


class UserService {
  static checkExists = async function ({
    userId,
    message = ErrorMessage.USER_NOT_FOUND,
    checkActive = true,
  }) {
    const foundUser = await findUserByIdLean(userId);
    if (!foundUser) {
      throw new BadRequestError(message);
    }
    if (checkActive && foundUser.status !== AppStatus.active) {
      throw new BadRequestError(`${ErrorMessage.USER_IS_DEACTIVED}`);
    }
    return foundUser;
  };

  static checkExistsByUsername = async function ({
    username,
    message = ErrorMessage.USER_NOT_FOUND,
    checkActive = true,
  }) {
    const foundUser = await findUserByUsername({username: username});
    if (!foundUser) {
      throw new BadRequestError(message);
    }
    if (checkActive && foundUser.status !== AppStatus.active) {
      throw new BadRequestError(`${ErrorMessage.USER_IS_DEACTIVED}`);
    }
    return foundUser;
  };

  static removeKeyToken = async function (userId) {
    await KeyTokenService.deleteKeyByUserId(userId);
    return;
  };

  static removeKeyTokenAndDevice = async function (userId) {
    await KeyTokenService.deleteKeyByUserId(userId);
    return;
  };

  //registerByAdmin
  static async register(body) {
    //current user register by phone
    const { username, password, confirmPassword } = body;

    if (password.toString() !== confirmPassword.toString()) {
      throw new BadRequestError(ErrorMessage.PASSWORD_NOT_MATCH); //PASSWORD_NOT_MATCH
    }

    const foundUser = await findUserByUsername({username: username});

    if (foundUser) {
      throw new ConflictResponse(ErrorMessage.USER_ALREADY_EXISTS); //USER_ALREADY_EXISTS
    }

    //create user
    const data = {
      ...body,
      verify: true,
    };

    const user = await createUser(data);

    if (!user) throw new BadRequestError(ErrorMessage.CREATE_USER_ERROR);

    return {
      success: true,
      message: ErrorMessage.USER_CREATED,
      data: getInfoData({
        object: user,
        fileds: USER_FILED_RETURN,
      }),
    };
  }

  static async findUserByUsernameAndPassword(username, password) {
    const user = await findUserByUsername({username: username, raw: false});
    if (!user) return null;

    const isMatch = await user.isCheckPassword(password); // đã hỗ trợ bcrypt
    return isMatch ? user : null;
}


  static async login(body) {
    const { username, password, deviceType, deviceToken } = body;
    const foundUser = await findUserByUsername({username: username, raw: false});
    if (!foundUser) {
      throw new NotFoundError(ErrorMessage.USER_NOT_FOUND); //USER_NOT_FOUND
    }

    const isValid = await foundUser.isCheckPassword(password);
    if (!isValid) {
      throw new BadRequestError(ErrorMessage.WRONG_PASSWORD); //WRONG_PASSWORD
    }

    if (foundUser.status !== AppStatus.active) {
      throw new NotFoundError(ErrorMessage.ACCOUNT_HAS_BEEN_DELETED); //ACCOUNT_HAS_BEEN_DELETED
    }

    // create token
    const privateKey = crypto.randomBytes(64).toString("hex");

    const {
      id: userId,
      fullName: fullName
    } = foundUser;
    const tokens = await createTokenPair({
      payload: {
        userId: userId,
        fullName: fullName,
      },
      privateKey: privateKey,
    });

    // save key token
    await KeyTokenService.createKeyToken({
      privateKey,
      userId,
    });
    const result = {
      userInfo: {
        ...getInfoData({
          object: foundUser,
          fileds: LOGIN_FILED_RETURN,
        }),
      },
      ...tokens,
    };

    return {
      success: true,
      message: ErrorMessage.LOGIN_SUCCESS,
      data: result,
    };
  }

  static async logout({ userId }) {
    await UserService.removeKeyTokenAndDevice(userId);
    return {
      success: true,
      message: ErrorMessage.LOGOUT_SUCCESS,
    };
  }

  static async getCurrentUser(userId) {
    const userData = await findUserDetaiById(userId);
    return userData;
  }

}

module.exports = UserService;
