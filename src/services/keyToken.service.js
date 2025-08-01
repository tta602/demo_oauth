'use strict';

const KeyToken = require('../models/keytoken.model');
const KEY = 'TOKEN_KEY';

class KeyTokenService {
  static getKey(userId) {
    return `${KEY}:${userId}`;
  }

  static createKeyToken = async ({ userId, privateKey }) => {
    try {
      // await del(KeyTokenService.getKey(userId)); // xoá cache nếu có

      const [tokenRecord, created] = await KeyToken.findOrCreate({
        where: { userId },
        defaults: {
          privateKey,
          refeshTokensUsed: []
        }
      });

      if (!created) {
        // Nếu đã tồn tại thì update
        await tokenRecord.update({
          privateKey,
          refeshTokensUsed: []
        });
      }

      return tokenRecord.privateKey;
    } catch (error) {
      console.error(`Error: ${error.message}`);
      return error;
    }
  };

  static findByUserIdLean = async (userId) => {
    // const keyToken = await getObject(KeyTokenService.getKey(userId)); // lấy từ cache nếu cần
    // if (keyToken) return keyToken;

    const foundKeyToken = await KeyToken.findOne({
      where: { userId },
      raw: true
    });

    // if (foundKeyToken) {
    //   await setObject({
    //     key: KeyTokenService.getKey(userId),
    //     data: foundKeyToken
    //   });
    // }

    return foundKeyToken;
  };

  static deleteKeyByUserId = async (userId) => {
    // await del(KeyTokenService.getKey(userId)); // xoá cache nếu dùng

    const deleted = await KeyToken.destroy({
      where: { userId }
    });

    return deleted; // trả về số row bị xoá (1 hoặc 0)
  };
}

module.exports = KeyTokenService;
