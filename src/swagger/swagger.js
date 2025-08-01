// src/swagger.js
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User API',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
        clientId: {
          type: "apiKey",
          name: "x-client-id",
          in: "header",
        },
      },
    },
  },
  apis: ['./src/routers/*/*.js'], // nơi chứa swagger comment (bạn có thể chỉnh lại theo project)
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
