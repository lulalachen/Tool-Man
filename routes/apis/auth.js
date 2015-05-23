// auth middleware
'use strict';
var TokenService = require('../../services/TokenService');
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function (req, res, next) {
	// check token
	var token;
	// check if token is in the headers
	// jwt spec: http://self-issued.info/docs/draft-ietf-oauth-json-web-token.html

	if (req.headers && req.headers.token) {
		// var parts = req.headers.authorization.split(' ');
		// // check hearder format
		// if (parts.length !== 2 || !/^Bearer$/i.test(parts[0])) {
		// 	return res.status(401).send('Header\'s format should be Authorization: Bearer [token]');
		// }
		token = req.headers.token;
		delete req.headers.token;
	}
	// check if token is in query
	// PLEASE DO NOT SET TOKEN THIS WAY IN PRODUCTION, USE HEADER
	if (!token) {
		token = !!req.query && !!req.query.token
			? req.query.token
			: null;
		delete req.query.token;
	}
	if (!!token) {
		// verify the token
		TokenService
		.verifyToken(token)
		.then(function (result) {
			return User
			.findOneAsync({ _id: result.id })
		})
		.then(function (user) {
			if (!user) return res.status(401).send('Can not find a memeber from the token.');
			req.user = user;
			next();
		})
		.catch(function (err) {
			res.status(401).send(err.message);
		});
	} else {
		res.status(401).send('unauthorized');
	}
	return;
};