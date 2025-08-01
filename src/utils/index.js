"use strict";
const md5 = require("md5");
const _ = require("lodash");


const getInfoData = ({ fileds = [], object = {} }) => {
  return _.pick(object, fileds);
};

/**
 *
 * @param {Array} select ["name", "age", "gender"];
 * @returns { JSON => { "name": 1, "age": 1, "gender": 1}}
 */
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

/**
 *
 * @param {Array} unSelect ["name", "age", "gender"];
 * @returns { JSON => { "name": 0, "age": 0, "gender": 0}}
 */
const unGetSelectData = (unSelect = []) => {
  return Object.fromEntries(unSelect.map((el) => [el, 0]));
};

const removeUndefinedObject = (obj) => {
  Object.keys(obj).forEach((k) => {
    if (obj[k] === undefined || obj[k] === null) {
      delete obj[k];
    }
  });

  return obj;
};

const updateNestedObjectParse = (obj, prefix = "") => {
  const result = {};
  Object.keys(obj).forEach((key) => {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (obj[key] === null || obj[key] === undefined) {
      console.log(`ingore key`, key);
    } else if (
      typeof obj[key] === "object" &&
      !Array.isArray(obj[key]) &&
      !(obj[key] instanceof Date) &&
      !(obj[key] instanceof Types.ObjectId)
    ) {
      console.log(
        `Nếu obj[key] là một object rỗng, gán giá trị vào key ${obj[key]}`,
        obj[key]
      );
      Object.assign(result, updateNestedObjectParse(obj[key], newKey));
    } else {
      result[newKey] = obj[key];
    }
  });

  return result;
};

function formatPaginatonPayload({ total, page, items, pagination }) {
  if (pagination === true) {
    return {
      total: total,
      currentPage: page,
      nextPage: page + 1,
      previousPage: page - 1,
      hasNextPage: items * page < total,
      hasPreviousPage: page > 1,
      totalPage: Math.ceil(total / items),
    };
  }
  return {};
}

function getRandomExpirationTime(minHours, maxHours) {
  const minSeconds = minHours * 3600;
  const maxSeconds = maxHours * 3600;
  return Math.floor(Math.random() * (maxSeconds - minSeconds + 1)) + minSeconds;
}

module.exports = {
  getInfoData: getInfoData,
  getSelectData: getSelectData,
  unGetSelectData: unGetSelectData,
  removeUndefinedObject: removeUndefinedObject,
  updateNestedObjectParse: updateNestedObjectParse,
  formatPaginatonPayload: formatPaginatonPayload,
  getRandomExpirationTime: getRandomExpirationTime,
};
