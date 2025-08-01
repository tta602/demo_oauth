'use strict';

const { StatusCodes, ReasonPhrases } = require('../utils/http_status_code');

class ErrorResponse extends Error {
  constructor(messgae, status) {
    super(messgae);
    this.status = status;
  }
}

class ConflictResponse extends ErrorResponse {
  constructor(
    messgae = ReasonPhrases.CONFLICT,
    statusCode = StatusCodes.CONFLICT, //409
  ) {
    super(messgae, statusCode);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(
    messgae = ReasonPhrases.BAD_REQUEST,
    statusCode = StatusCodes.BAD_REQUEST, //400
  ) {
    super(messgae, statusCode);
  }
}

class AuthFailureError extends ErrorResponse {
  constructor(
    messgae = ReasonPhrases.UNAUTHORIZED,
    statusCode = StatusCodes.UNAUTHORIZED, //401
  ) {
    super(messgae, statusCode);
  }
}


class NotFoundError extends ErrorResponse {
  constructor(
    messgae = ReasonPhrases.NOT_FOUND,
    statusCode = StatusCodes.NOT_FOUND, //404
  ) {
    super(messgae, statusCode);
  }
}

class ForbiddenError extends ErrorResponse {
  constructor(
    messgae = ReasonPhrases.FORBIDDEN,
    statusCode = StatusCodes.FORBIDDEN, //403
  ) {
    super(messgae, statusCode);
  }
}

class ServerBusyError extends ErrorResponse {
  constructor(
    messgae = ReasonPhrases.SERVICE_UNAVAILABLE,
    statusCode = StatusCodes.SERVICE_UNAVAILABLE, 
  ) {
    super(messgae, statusCode);
  }
}

module.exports = {
  ErrorResponse,
  ConflictResponse,
  BadRequestError,
  AuthFailureError,
  NotFoundError,
  ForbiddenError,
  ServerBusyError
};
