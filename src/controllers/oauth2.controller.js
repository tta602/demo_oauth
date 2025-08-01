"use strict";

const { Request, Response } = require("oauth2-server");
const OAuth2Server = require("oauth2-server");

const {
  SuccessResponse,
  CREATED,
} = require("../core/success.response");

const { BadRequestError } = require("../core/error.response");
const BaseController = require("./base/base.controller");
const OAuthService = require("../services/oauth.service");
const ErrorMessage = require("../enum/error.message");

class OAuth2Controller extends BaseController {
  constructor() {
    super();
    this.server = new OAuth2Server({
      model: OAuthService,
    });
  }

  authorize = async (req, res, next) => {
    try {
      const { client_id, state } = req.query || {};
      if (!client_id || !state) throw new BadRequestError("Missing client_id or state");

      const sessionUserId = req.session[`${client_id}_${state}`];

      if (!sessionUserId) {
        
        req.session[`${req.query.state}_authkey`] = req.query;
        const queryParams = new URLSearchParams(req.query).toString();

        const loginUrl = `/api/v1/oauth/login?${queryParams}`;
        // return res.status(401).json({
        //     error: "unauthenticated",
        //     message: "You need to login first. Please click the link below to login.",
        //     login_url: `${req.protocol}://${req.get("host")}${loginUrl}`,
        // });
        return res.redirect(loginUrl);
      }

      const request = new Request(req);
      const response = new Response(res);

      const result = await this.server.authorize(request, response, {
        authenticateHandler: {
          handle: async () => {
            const { client_id } = req.query || {};
            if (!client_id) throw new BadRequestError("Missing client_id");

            const client = await OAuthService.getClientById(client_id);
            if (!client) throw new BadRequestError("Client not found");

            const user = await OAuthService.getUserForAuthorization({
              sessionUserId: sessionUserId,
              clientUserId: client.userId,
            });

            if (!user) throw new BadRequestError("User not found after login");
            return { id: user.id };
          },
        },
      });

      await new SuccessResponse({
        message: "Authorization successful",
        data: result,
      }).send(req, res);
    } catch (err) {
      console.log("Authorize error:", err);
      res.status(err.code || 500).json(err instanceof Error ? { error: err.message } : err);
    }
  };

  token = async (req, res, next) => {
    try {
      const request = new Request(req);
      const response = new Response(res);

      const result = await this.server.token(request, response, {
        alwaysIssueNewRefreshToken: false,
      });

      await new SuccessResponse({
        message: "Token issued",
        data: result,
      }).send(req, res);
    } catch (err) {
      console.log("Token error:", err);
      res.status(err.code || 500).json(err instanceof Error ? { error: err.message } : err);
    }
  };

  authenticate = async (req, res, next) => {
    try {
      const request = new Request(req);
      const response = new Response(res);

      const data = await this.server.authenticate(request, response);

      req.auth = {
        userId: data?.user?.id,
        sessionType: "oauth2",
      };

      next();
    } catch (err) {
      console.log("Authentication error:", err);
      res.status(err.code || 500).json(err instanceof Error ? { error: err.message } : err);
    }
  };

  revoke = async (req, res, next) => {
    try {
      const { token, token_type_hint } = req.body;
      if (!token) {
        return res.status(400).json({ error: "Missing token" });
      }

      // Gọi hàm trong OAuthService để xóa token khỏi DB
      const revoked = await OAuthService.revokeToken(token, token_type_hint);

      if (!revoked) {
        return res.status(400).json({ error: "Token not found or already revoked" });
      }

      return res.status(200).json({ success: revoked, message: "Token revoked" });
    } catch (err) {
      console.error("Revoke error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };


  test = async (req, res, next) => {
    const { userId } = req.auth || {};
    if (!userId) throw new BadRequestError(ErrorMessage.USER_NOT_FOUND);

    const user = await OAuthService.getUserById(userId);
    this.checkDataNotNull(user, ErrorMessage.USER_NOT_FOUND);

    await new SuccessResponse({
      message: "User authenticated",
      data: {
        id: user.id,
        username: user.username,
      },
    }).send(req, res);
  };
}

module.exports = new OAuth2Controller();
