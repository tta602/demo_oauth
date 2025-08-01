'use strict';
const { format, createLogger, transports } = require('winston');
require('winston-daily-rotate-file');

const { v4: uuidv4 } = require('uuid');
/*
  error, nghiem trong
  warning,
  debug, phat trien trong dev
  info,
  requestId or traceId, ghi vao file log
*/
class MyLogger {
  constructor(name = 'application') {
    this.name = name;
    const formatPrint = format.printf(
      ({ level, message, context, requestId, timestamp, data }) => {
        return `====R====>${timestamp}::${level}::${context}::${requestId}::${message}::${JSON.stringify(
          data
        )}`;
      }
    );

    this.logger = createLogger({
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        formatPrint
      ),
      transports: [
        new transports.Console(),
        new transports.DailyRotateFile({
          dirname: 'src/logs',
          filename: `${this.name}-%DATE%.info.log`,
          datePattern: 'YYYY-MM-DD', //-HH-mm
          zippedArchive: true, //true backup log zig
          maxSize: '20m', //dung luong file
          maxFiles: '14d', // neu dat xoa log trong 14 ngay
          format: format.combine(
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            formatPrint
          ),
          level: 'info',
        }),
        new transports.DailyRotateFile({
          dirname: 'src/logs',
          filename: `${this.name}-%DATE%.error.log`,
          datePattern: 'YYYY-MM-DD', //-HH-mm
          zippedArchive: true, //true backup log zig
          maxSize: '20m', //dung luong file
          maxFiles: '14d', // neu dat xoa log trong 14 ngay
          format: format.combine(
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            formatPrint
          ),
          level: 'error',
        })
      ],
    });
  }

  commonParams(params) {
    let context, req, data;
    if (!Array.isArray(params)) {
      context = params;
    } else {
      [context, req, data] = params;
    }
    const requestId = req?.requestId || uuidv4();

    return {
      context,
      requestId,
      data,
    };
  }

  log(message, params) {
    const paramLog = this.commonParams(params);
    const logObject = Object.assign(
      {
        message,
      },
      paramLog
    );

    this.logger.info(logObject);
  }

  error(message, params) {
    const paramLog = this.commonParams(params);
    const logObject = Object.assign(
      {
        message,
      },
      paramLog
    );

    this.logger.error(logObject);
  }
}

module.exports = {
  applicationLogger: new MyLogger("sf-application"),
  draftLeadLogger: new MyLogger("draftlead-job"),
  opptyLogger: new MyLogger("oppty-job"),
  sendEmailLogger: new MyLogger("sendEmail-job"),
};
