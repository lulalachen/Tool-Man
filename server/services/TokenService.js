// TokenService.js
'use strict'

var Promise = require('bluebird');
var jwt = Promise.promisifyAll(require('jsonwebtoken'));
var config = require( '../config/environment' );

module.exports = {
  // return token
  issueToken: function(payload) {
    return jwt.sign(payload, config.TOKEN_SECRET, {
        expiresInMinutes: config.TOKEN_EXP
      });
  },
  // return a Promise which will decode the token
  verifyToken: function(token) {
    return jwt.verifyAsync(token, config.TOKEN_SECRET)
  }
}