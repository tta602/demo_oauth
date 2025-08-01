"use strict";

const { applicationLogger } = require("../loggers/mylogger.log");

const StatusCode = {
  CREATED: 201,
  OK: 200,
};

const ReasonStatusCode = {
  CREATED: "Created!",
  OK: "SUCCESS",
};

class SuccessResponse {
  constructor({
    success,
    message,
    statusCode = StatusCode.OK,
    reasonStatusCode = ReasonStatusCode.OK,
    data = {},
  }) {
    this.success = success ?? true;
    this.message = !message ? reasonStatusCode : message;
    this.code = statusCode;
    this.data = data;
  }

  async send(
    req,
    res,
    options = {
      saveDataLog: false,
      deleteCaching: false,
      saveCaching: false,
      deleteOptions: [],
    }
  ) {
    // if (options.saveCaching) {
    //   await cachingUtil.setClientDataCache(req, this);
    // }
    // if (options.deleteCaching) {
    //   options.deleteOptions.push(req.baseUrl);
    //   await cachingUtil.deleteClientDataCache(options.deleteOptions);
    // }

    if (options.saveDataLog) {
      applicationLogger.log(`output data::: ${req.method}`, [
        req.path,
        {
          requestId: req.requestId,
        },
        {
          data: this,
        },
      ]);
    }
    return res.status(this.code).json(this);
  }
}

class OK extends SuccessResponse {
  constructor({ success, message, data }) {
    super({ success, message, data });
  }
}

class GETLISTOK extends SuccessResponse {
  constructor({ success, pagination = {}, message, data, totalInfo }) {
    super({ success, message, data });
    this.pagination = pagination;
    this.totalInfo = totalInfo;
  }
}

class CREATED extends SuccessResponse {
  constructor({
    message,
    statusCode = StatusCode.CREATED,
    reasonStatusCode = ReasonStatusCode.CREATED,
    data,
  }) {
    super({ message, statusCode, reasonStatusCode, data });
  }
}

module.exports = {
  OK,
  CREATED,
  GETLISTOK,
  SuccessResponse,
};
