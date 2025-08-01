"use strict";
const JWT = require("jsonwebtoken");

const asyncHandler = require("../helpers/asyncHandler");
const ErrorMessage = require("../enum/error.message");

const { apptoken } = require("../config/config.app");
const {
  AuthFailureError,
  BadRequestError,
  ForbiddenError,
} = require("../core/error.response");

//services
const KeyTokenService = require("../services/keyToken.service");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
  RESFRESHTOKEN: "x-rtoken-id",
  TIMEZONE: "x-timezone",
};

const createTokenPair = async ({ payload, privateKey }) => {
  const accessToken = JWT.sign(payload, privateKey, {
    expiresIn: apptoken.timeout,
  });

  return {
    accessToken,
  };
};

const createTokenPairForgotPass = async ({ payload }) => {
  const accessToken = JWT.sign(payload, apptoken.forgot_pass_key, {
    expiresIn: apptoken.forgot_pass_timeout,
  });

  return {
    accessToken,
  };
};

const verifyJWT = async (token, keySecret) => {
  return JWT.verify(token, keySecret);
};

const authentication = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError(ErrorMessage.INVALID_REQUEST);

  //2
  const keyStore = await KeyTokenService.findByUserIdLean(userId);
  if (!keyStore) throw new AuthFailureError(ErrorMessage.KEY_TOKEN_NOT_FOUND);

  //3
  const accessToken = req.headers[HEADER.AUTHORIZATION];

  if (!accessToken || !accessToken.startsWith('Bearer '))
    throw new AuthFailureError(ErrorMessage.INVALID_REQUEST_TOKEN);

  const token = accessToken.split(' ')[1];

  try {
    const decodeUser = JWT.verify(token, keyStore.privateKey);
    if (userId !== decodeUser.userId)
      throw new AuthFailureError(ErrorMessage.INVALID_USER_ID);

    // req.keyStore = keyStore;
    req.user = decodeUser;

    return next();
  } catch (error) {
    console.log(error);
    throw new AuthFailureError(ErrorMessage.TOKEN_INVALID);
  }
});

const isPermission = (permission) => {
  return async (req, res, next) => {
    const user_role_code = req.user_role_code;
    if (!permission.includes(user_role_code)) {
      return next(new ForbiddenError(ErrorMessage.PERMISSION_DENIED));
    }
    return next();
  };
};

const isTimezone = async (req, res, next) => {
  try {
    const timezone = req.headers[HEADER.TIMEZONE];
    if (!timezone) {
      return next(new BadRequestError(ErrorMessage.TIMEZONE_IS_REQUIRED)); //TIMEZONE_IS_REQUIRED
    }
    req.timezone = timezone;
    next();
  } catch (error) {
    next(error);
  }
};


module.exports = {
  createTokenPair,
  verifyJWT,
  authentication,
  isPermission,
  isTimezone,
  createTokenPairForgotPass,
};
