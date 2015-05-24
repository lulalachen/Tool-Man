// token router
'use strict';
var mongoose = require('mongoose');
var User = mongoose.model('User');

var FB = require('fb');
var async = require('async');
var express = require('express');
var router = express.Router();
var TokenService = require('../../services/TokenService')
var auth = require('./auth');
var config = require( '../../config/environment' );
FB.setAccessToken( config.FB_APPID + "|" + config.FB_APPSECRET );

router.post('/', function(req, res, next) {
	if (!req.body) return res.status(400).send('missing request body.');
	if (!req.body.token) return res.status(400).send('missing token.');
	if (!req.body.provider) return res.status(400).send('missing token provider.');

	var token = req.body.token;

	// TODO: implement other 3rd party services
	// TODO: do not use asyc. it's so ugly.
	var verifyTokenFrom = {
		facebook: function(callback) {
			var fbId;

			// fb api sucks (it's hard to promisified), so we use async intead of promise
			async.waterfall([
				function (cb) {
					// check fb access token
					FB.api('debug_token', { input_token : token }, function (result){
						// console.log('fb api result: ', result)
						if( result.error || (result.data && result.data.error) ) {
							var msg = result.data?	result.data.error.message : result.error.message;
							return cb( new Error( 'FB Graph api: ' + msg ));
						}
						return cb(null, result)
					});
				},
				function (result, cb){
					// load member
					fbId = String(result.data.user_id);
					// console.log(fbId)
					User
					.findOne({ fbId: fbId })
					.exec(function (err, user) {
						if (err) return cb(err);
						if (!user) return cb(null, null); // if user is undefined, set it to be null in cb.
						return cb(null, user);
					});
				},
				function (user, cb){
					if (!!user) return cb(null, user); // user exists,
					// user did not exist, create one
					// load fb info
					FB.api(fbId, { fields: [
						'id',
						'name',
						'email',
						]}, function (result) {
						// console.log('fb: ', result);
						// modified result
						new User({
							fbId: result.id,
							name: result.name,
							email: result.email,
						}).save(cb);
					});
				},
			], function (err, user) {
				if (err) return callback(err);
				callback(null, user);
			});
		}
	};

	if (!verifyTokenFrom[req.body.provider]) return res.status(401).send('Sorry, we are not support ' + req.body.provide + ' currently.');
	verifyTokenFrom[req.body.provider](function (err, user) {
		console.log(req.body)
		if (err) return res.status(401).send(err.message);
		var token = TokenService.issueToken({
			id: user.id
		});
		res.send(token);
	});

});

module.exports = router;
