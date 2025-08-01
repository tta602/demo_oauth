'use strict';
const { v4: uuid } = require('uuid');
const OAuthClient = require('../models/oauth_client.model.js');
const OAuthAccessToken = require('../models/oauth_access_token.model');
const OAuthRefreshToken = require('../models/oauth_refresh_token.model');
const OAuthAuthorizationCode = require('../models/oauth_authorization_code.model');
const Users = require('../models/user.model.js');

const getClientById = async (clientId) => {
  return await OAuthClient.findOne({ where: { clientId } });
};

const getUserForAuthorization = async ({ sessionUserId, clientUserId }) => {
  if (clientUserId) {
    return await Users.findOne({ where: { id: clientUserId } });
  }
  return await Users.findOne({ where: { id: sessionUserId } });
};

const getUserById = async (userId) => {
  return await Users.findOne({ where: { id: userId } });
};

async function getClient(clientId, clientSecret) {
  const query = {
    where: {
      clientId,
      ...(clientSecret && { clientSecret })
    }
  };

  const client = await OAuthClient.findOne(query);
  if (!client) throw new Error("Client not found");

  return {
    id: client.clientId,
    grants: client.grants,
    redirectUris: [client.callbackUrl]
  };
}

async function saveAuthorizationCode(code, client, user) {
  const savedCode = await OAuthAuthorizationCode.create({
    id: uuid(),
    authorizationCode: code.authorizationCode,
    expiresAt: code.expiresAt,
    redirectUri: code.redirectUri,
    scope: code.scope,
    clientId: client.id,
    userId: user.id || user.id
  });

  return {
    ...code,
    client: { id: client.id },
    user: { id: user.id || user.id }
  };
}

async function getAuthorizationCode(authorizationCode) {
  const code = await OAuthAuthorizationCode.findOne({ where: { authorizationCode } });
  if (!code) throw new Error("Authorization code not found");

  return {
    code: code.authorizationCode,
    expiresAt: code.expiresAt,
    redirectUri: code.redirectUri,
    scope: code.scope,
    client: { id: code.clientId },
    user: { id: code.userId }
  };
}

async function revokeAuthorizationCode({ code }) {
  const res = await OAuthAuthorizationCode.destroy({ where: { authorizationCode: code } });
  return res === 1;
}

async function revokeToken(token, token_type_hint) {
  if (!token) return false;

  switch (token_type_hint) {
    case "refresh_token":
      return (await OAuthRefreshToken.destroy({ where: { refreshToken: token } })) > 0;
    case "access_token":
    default:
      return (await OAuthAccessToken.destroy({ where: { accessToken: token } })) > 0;
  }
}

async function saveToken(token, client, user) {
  await OAuthAccessToken.create({
    id: uuid(),
    accessToken: token.accessToken,
    accessTokenExpiresAt: token.accessTokenExpiresAt,
    scope: token.scope,
    clientId: client.id,
    userId: user.id
  });

  if (token.refreshToken) {
    await OAuthRefreshToken.create({
      id: uuid(),
      refreshToken: token.refreshToken,
      refreshTokenExpiresAt: token.refreshTokenExpiresAt,
      scope: token.scope,
      clientId: client.id,
      userId: user.id
    });
  }

  return {
    accessToken: token.accessToken,
    accessTokenExpiresAt: token.accessTokenExpiresAt,
    refreshToken: token.refreshToken,
    refreshTokenExpiresAt: token.refreshTokenExpiresAt,
    scope: token.scope,
    client: { id: client.id },
    user: { id: user.id },

    access_token: token.accessToken,
    refresh_token: token.refreshToken
  };
}

async function getAccessToken(accessToken) {
  const token = await OAuthAccessToken.findOne({ where: { accessToken } });
  if (!token) throw new Error("Access token not found");

  return {
    accessToken: token.accessToken,
    accessTokenExpiresAt: token.accessTokenExpiresAt,
    scope: token.scope,
    client: { id: token.clientId },
    user: { id: token.userId }
  };
}

async function getRefreshToken(refreshToken) {
  const token = await OAuthRefreshToken.findOne({ where: { refreshToken } });
  if (!token) throw new Error("Refresh token not found");

  return {
    refreshToken: token.refreshToken,
    refreshTokenExpiresAt: token.refreshTokenExpiresAt,
    scope: token.scope,
    client: { id: token.clientId },
    user: { id: token.userId }
  };
}

async function createDefaultOAuthClient() {
  const defaultClientId = 'test-client-id';
  const defaultClientSecret = 'test-client-secret';

  const existing = await OAuthClient.findOne({ where: { clientId: defaultClientId } });
  if (!existing) {
    await OAuthClient.create({
      id: uuid(),
      clientId: defaultClientId,
      clientSecret: defaultClientSecret,
      grants: ['authorization_code', 'refresh_token'],
      callbackUrl: 'http://localhost:3000/callback'
    });
    console.log("Default OAuth client created.");
  } else {
    console.log("Default OAuth client already exists.");
  }
}

module.exports = {
  getClientById,
  getUserForAuthorization,
  getUserById,
  saveToken,
  saveAuthorizationCode,
  revokeAuthorizationCode,
  revokeToken,
  getAuthorizationCode,
  getAccessToken,
  getClient,
  getRefreshToken,
  createDefaultOAuthClient
};
