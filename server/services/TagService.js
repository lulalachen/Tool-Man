// TagService.js
'use strict'

var Promise = require('bluebird'),
	mongoose = require('mongoose'),
	Tag = mongoose.model('Tag'),
	User = mongoose.model('User');

module.exports = {
  addTag : function(newTag, user_id, res){

  	newTag.save(function(err, tag){
		if(!err){
			User.findById(user_id, function(err, user){
				if (!err){

					user.tags.push({
						tag_id : tag._id,
						name : tag.name
					})

					user.save(function(err, user){
						if(!err)
							return res.status(200).send('[ Tag ] - New tag ' + tag.name + ' saved.');
						else
							return res.status(401).send('[ Tag ] - New tag ' + tag.name + ' unsaved.');
					})
				} else 
					return res.status(401).send('[ Tag ] - Cannot find user.');
			})
		}
		else
			return res.status(400).send(err);
	})

  },
  removeTag : function(tag, user_id, res){

  	tag.remove(function(err, tag, count){
  		console.log(tag)
  		if(!err){
  			User.findById({
  				_id : user_id
  			})
  			.then(function(user){
  				for (var i = 0; i < user.tags.length; i++){
	  				if ( user.tags[i].tag_id === user_id ){
	  					user.tags.splice(i,1);
	  				}
  				}
  				user.save(function(err, user, count){
  					if(!err)
			  			return res.status(200).send('[ Tag ] - Tag ' + tag.name + ' removed.')
			  		else
			  			return res.status(401).send('[ Tag ] - Remove failed.')
  				})
  			})
  		}
  		else
  			return res.status(401).send('[ Tag ] - Tag ' + tag.name + ' removed failed.')

  	})

  }


}