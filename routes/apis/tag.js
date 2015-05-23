// tag router
'use strict';

var express = require('express'),
	router = express.Router(),
	_ = require('lodash'),
	MetaInspector = require('node-metainspector'),
	mongoose = require('mongoose'),
	auth = require('./auth.js'),
	Tag = mongoose.model('Tag');

// Get tag info ( All or Specific )//
router.get('/', auth, function(req, res, next) {
	var user_id = req.query.user_id || req.body.user_id,
		tagName = req.query.tagName || req.body.tagName;

	if (!user_id) return res.status(400).send('missing query user_id.');

	Tag
	.findAsync({
		user_id : user_id 
	})
	.then(function (tags) {
		res.send(tags)
	})
	.catch(function (err) {
		next(err);
	});

});

// Push new tag into DB //
router.post('/', auth, function(req,res,next) { 
	var tagName = req.query.tagName || req.body.tagName,
		user_id = req.user.id,
		friendList = req.query.friendList || req.body.friendList;
		console.log(req.body)
	
	// Find if tagName already exist //
	Tag
	.findOne({
		tagName : tagName
	})
	.then(function(tag){
		if(!tag){
			var newTag = new Tag();

			newTag.tagName 	= tagName;
			newTag.user_id	= user_id;
			newTag.friendList = friendList;
			console.log(newTag);

			newTag.save(function(err, tag){
				if(!err)
					return res.status(200).send('[ Tag ] - New tag ' + tag.tagName + ' saved.');
				else
					return res.status(400).send(err);
			})
		} else {
			console.log(tag)
			for (var i = 0; i < friendList.length; i++){
				if ( !tag.friendList.contains( friendList[i] ) ){
					tag.friendList.push( friendList[i] );
				}
			}
			tag.save(function(err, tag, count){
				if (!err)
					return res.status(200).send('[ Tag ] - Tag ' + tag.tagName + ' updated.')
				else
					return res.status(400).send(err);
			})
		}
	})
	.catch(function(err){
		next(err);
	})
});

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}


module.exports = router;
