"use strict";
const express = require("express");
const session = require("express-session");
const compression = require("compression");
const helmet = require("helmet");
const path = require("path");
const morgan = require("morgan");
const cors = require("cors");
const { applicationLogger } = require("./loggers/mylogger.log");
const ErrorMessage = require("./enum/error.message");
const { NotFoundError } = require("./core/error.response");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swagger');
const { v4: uuidv4 } = require("uuid");

const {
  app: { port },
} = require('./config/config.app');

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/** init middleware */
app.use(
  cors({
    origin: "*",
    optionsSuccessStatus: 200,
    credentials: true
  })
);
app.use(
  session({
    secret: "supersecret", // Change this to a strong, random string in production
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
  })
);

// app.use(helmet());
app.use(morgan("combined"));
app.use(compression());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCssUrl: '/swagger-ui.css', // ép file nội bộ
  swaggerOptions: {
    url: '/swagger.json', // dùng nội bộ luôn, không qua https
  },
}));

app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use('/swagger-ui.css', (req, res) => {
  res.redirect('http://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.css');
});

app.use((req, res, next) => {
  const requestId = req.headers["x-request-id"];
  req.requestId = requestId ? requestId : uuidv4();
  req.requestDateNow = Date.now();
  applicationLogger.log(`input param::: ${req.method}`, [
    req.path,
    {
      requestId: req.requestId,
    },
    {
      query: req.query,
      body: req.body,
    },
  ]);

  next();
});

/**Define router */
app.use("/", require("./routers"));

/**Catch 404 */
app.use((req, res, next) => {
  global._baseurl = req.url;
  next(new NotFoundError(ErrorMessage.PAGE_NOT_FOUND));
});

/**Tracking error */
app.use(async (error, req, res, next) => {
  // add log to save and track errors
  const statusCode = error.status || 500;
  const errorMessage =
    statusCode === 500 ? ErrorMessage.SOMETHING_WENT_WRONG : error.message;

  const resMessage = `${statusCode} - ${
    Date.now() - req.requestDateNow
  }ms - Response: ${JSON.stringify(error)}`;
  applicationLogger.error(resMessage, [
    req.path,
    {
      requestId: req.requestId,
    },
    {
      message: error.message,
      body: req.body,
    },
  ]);

  if (statusCode === 500) {
    console.error(error.stack);
  }

  res.status(statusCode).json({
    success: false,
    message: errorMessage,
  });
});

module.exports = app;
