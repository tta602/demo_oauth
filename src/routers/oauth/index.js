"use strict";

const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const OAuth2Controller = require("../../controllers/oauth2.controller");

const router = express.Router();

/**
 * @swagger
 * /api/v1/oauth/authorize:
 *   get:
 *     summary: OAuth2 authorization endpoint
 *     tags: [OAuth2]
 *     parameters:
 *       - in: query
 *         name: client_id
 *         required: true
 *         schema:
 *           type: string
 *           example: test-client-id
 *       - in: query
 *         name: response_type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [code]
 *       - in: query
 *         name: redirect_uri
 *         required: true
 *         schema:
 *           type: string
 *           example: http://localhost:3000/callback
 *       - in: query
 *         name: scope
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: state
 *         required: false
 *         schema:
 *           type: string
 *           example: 112233
 *     responses:
 *       302:
 *         description: Redirects to client redirect_uri with authorization code
 */
router.get("/authorize", asyncHandler(OAuth2Controller.authorize));

/**
 * @swagger
 * /api/v1/oauth/token:
 *   post:
 *     summary: Token endpoint
 *     tags: [OAuth2]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               grant_type:
 *                 type: string
 *                 example: authorization_code
 *               code:
 *                 type: string
 *               redirect_uri:
 *                 type: string
 *                 example: http://localhost:3000/callback
 *               client_id:
 *                 type: string
 *                 example: test-client-id
 *               client_secret:
 *                 type: string
 *                 example: test-client-secret
 *             required:
 *               - grant_type
 *               - code
 *               - redirect_uri
 *               - client_id
 *               - client_secret
 *     responses:
 *       200:
 *         description: Token response
 */
router.post("/token", asyncHandler(OAuth2Controller.token));

/**
 * @swagger
 * /api/v1/oauth/authenticate:
 *   get:
 *     summary: Check access token
 *     tags: [OAuth2]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Authenticated user info
 */
router.get("/authenticate", asyncHandler(OAuth2Controller.authenticate), asyncHandler(OAuth2Controller.test));

/**
 * @swagger
 * /api/v1/oauth/revoke:
 *   post:
 *     summary: Revoke access or refresh token
 *     tags: [OAuth2]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *               token_type_hint:
 *                 type: string
 *                 enum: [access_token, refresh_token]
 *     responses:
 *       200:
 *         description: Token revoked
 */
router.post(
  "/revoke",
  asyncHandler(OAuth2Controller.revoke)
);

router.get("/login", (req, res) => {
  // req.session.oauth2AuthQuery = req.query;
  const { client_id, redirect_uri, state } = req.query;
  res.render("login",{
    client_id,
    redirect_uri,
    state,
    error: null, // hoặc error nếu có từ session hoặc flash
  }); // Must have login.ejs or equivalent view
});

module.exports = router;
