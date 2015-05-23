// tag router
'use strict';

var express = require('express'),
	router = express.Router(),
	_ = require('lodash'),
	MetaInspector = require('node-metainspector'),
	mongoose = require('mongoose'),
	auth = require('./auth.js'),
	TagService = require('../../services/TagService'),
	Tag = mongoose.model('Tag'),
	User = mongoose.model('User');

// Get tag info ( All or Specific )//
router.get('/', auth, function(req, res, next) {
	var user_id = req.query.user_id || req.body.user_id,
		name = req.query.name || req.body.name,
		tag_id = req.query.tag_id || req.body.tag_id;

	if (!user_id) return res.status(400).send('missing query user_id.');

	if (!tag_id){
		Tag
		.findAsync({
			user_id : user_id 
		})
		.then(function (tags) {
			res.status(200).send(tags)
		})
		.catch(function (err) {
			next(err);
		});
	} else {
		Tag
		.findById({
			_id : tag_id
		})
		.then(function(tag){
			res.status(200).send(tag)
		})
	}

});

// Push new tag & refresh tag //
router.post('/', auth, function(req,res,next) { 
	var name = req.query.name || req.body.name,
		user_id = req.user.id,
		friendList = req.query.friendList || req.body.friendList;
	
	// Find if name already exist //
	Tag.findOne({
		name : name
	})
	.then(function(tag){
		console.log(tag)
		if(!tag){
			var newTag = new Tag();

			newTag.name 	= name;
			newTag.user_id	= user_id;
			newTag.friendList = friendList;

			TagService.addTag(newTag, user_id, res);

		} else {
			console.log(tag)
			for (var i = 0; i < friendList.length; i++){
				if ( !tag.friendList.contains( friendList[i] ) ){
					tag.friendList.push( friendList[i] );
				}
			}
			tag.save(function(err, tag, count){
				if (!err)
					return res.status(200).send('[ Tag ] - Tag ' + tag.name + ' updated.')
				else
					return res.status(400).send(err);
			})
		}
	})
	
});

router.delete('/', auth, function(req, res, next){

	var name = req.query.name || req.body.name,
		tag_id = req.query.tag_id || req.body.tag_id;
	
	// Find if name already exist //
	Tag.findById({
		_id : tag_id
	})
	.then(function(tag){
		if (tag)
			TagService.removeTag(tag, tag.user_id, res);
		else
			return res.status(401).send('[ Tag ] - Tag not found.')
	})

})








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
