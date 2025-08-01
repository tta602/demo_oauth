'use strict';
const path = require('path');
const env = process.env.NODE_ENV || 'dev';


const generalConfid = {
  environment: env,
  // smtp: {
  //   host: process.env.SMTP_HOST,
  //   port: process.env.SMTP_PORT,
  //   user: process.env.SMTP_USER,
  //   password: process.env.SMTP_PASSWORD,
  // },
  apptoken: {
    timeout: process.env.TOKEN_TIMEOUT,
    timeout_cache: process.env.TOKEN_TIMEOUT_REDIS,
   },
  // redis: {
  //   port: process.env.REDIS_PORT,
  //   host: process.env.REDIS_HOST,
  //   ttl_data_cache: process.env.TTL_DATA_CACHE, //30p
  //   ttl_request_cache: process.env.TTL_REQUEST_CACHE, //3p
  // },
};

const dev = {
  ...generalConfid,
  app: {
    appkey: process.env.DEV_APP_KEY,
    port: process.env.DEV_PORT,
    mariadbHost: process.env.DEV_MARIADB_HOST,
    mariadbUser: process.env.DEV_MARIADB_USER,
    mariadbPassword: process.env.DEV_MARIADB_PASSWORD,
    mariadbDatabase: process.env.DEV_MARIADB_DATABASE
  },
};

const config = { dev };
console.log(`Initializing Config App at ${env} environment`);
module.exports = config[env];
