'use strict';

const { BadRequestError } = require("../../core/error.response");
const { updateNestedObjectParse } = require("../../utils");

class BaseController {
  validate(body, validateFunction) {
    const { error } = validateFunction(body);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }
    return;
  }

  checkDataNotNull(data, message) {
    if(!data) {
      throw new BadRequestError(message);
    }
    return data;
  }

  checkModifiedCount(data, message) {
    if(data !== 1) {
      throw new BadRequestError(message);
    }
    return data;
  }

  getPageAndItem(query){
    const processed = {
      page: +query.page || 1,
      items: +query.items || 10,
      pagination: query?.pagination === 'false' ? false : true,
    };

    // Nếu bạn muốn giới hạn giá trị items, bạn có thể thêm mã sau đây:
    const maxItems = 500;
    processed.items = Math.min(processed.items, maxItems);

    return processed;
  }

  updateNestedObjectParse(data){
    const newData = updateNestedObjectParse(data);
    return newData;
  }

  /**
   * 
   * @param {*} req 
   * @param {*} data là object data để lưu
   * @param {*} keyName là key của object chứa link của ảnh
   * @returns 
   */
  async getImageFile(req, data, keyName){
    if(!keyName || keyName === ""){
      return data;
    }

    if (req.file) {
      // image = await uploadSinge(req.file);
      const image = await UploadLocal.uploadFile(req);
      return {
        ...data,
        [keyName]: image,
      }
    }
    return data;
  }
}

module.exports = BaseController;
