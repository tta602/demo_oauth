"use strict";

const express = require("express");
const {
  authentication,
  isPermission,
  authForgotPassOtp,
} = require("../../auth/authUtils");

const userController = require("../../controllers/user.controller");
const asyncHandler = require("../../helpers/asyncHandler");

const router = express.Router();

/**
 * @swagger
 * /api/v1/user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Nguyen Van A
 *               username:
 *                 type: string
 *                 example: user001
 *               password:
 *                 type: string
 *                 example: T@123456
 *               confirmPassword:
 *                 type: string
 *                 example: T@123456
 *             required:
 *               - fullName
 *               - username
 *               - password
 *               - confirmPassword
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error or user already exists
 */

router.post("/register", asyncHandler(userController.register));

router.post("/login", asyncHandler(userController.oauthLogin));


module.exports = router;
