"use strict";
const Joi = require("joi");

const newPassregex = /^(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
// const phoneNumberRegex = /^(?:0)\d{9}$/;

class UserValidator {
  registerValidate(body) {
    const scheme = Joi.object({
      fullName: Joi.string().required(),
      username: Joi.string().required(),
      password: Joi.string().pattern(newPassregex).required(),
      confirmPassword: Joi.string().pattern(newPassregex).required(),
      // phone: Joi.string().pattern(phoneNumberRegex).required(),
    });

    return scheme.validate(body);
  }

  login(body) {
    const scheme = Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required(),
      client_id: Joi.string(), 
      redirect_uri: Joi.string(), 
      state: Joi.string()
      // deviceType: Joi.string().required(),
      // deviceToken: Joi.string(),
    }).required();

    return scheme.validate(body);
  }
}

module.exports = new UserValidator();
