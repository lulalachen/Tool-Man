var express = require('express'),
	router = express.Router(),
	FB = require('fb'),
	auth = require('./auth'),
	config = require( '../../config/environment' ),
	mongoose = require('mongoose'),
	User = mongoose.model('User');


router.get('/',function(req,res) { 
	User.find(function(err, users){
		res.send(users)
	})
});


router.get('/fbFriends', auth, function(req, res){
	

	FB.setAccessToken( config.FB_APPID + "|" + config.FB_APPSECRET );

	var limit = req.query.limit || req.body.limit;
    var offset = req.query.offset || req.body.offset;

    limit = limit || 25;
    offset = offset || 0;
    console.log(req.user)
    var path = 'v2.3/' + req.user.fbId + '/friends';
    FB.api(path, function(friends){
      if(!friends || friends.error) {
          // console.log(!friends ? 'error occurred' : friends.error);
          return;
      }
      res.send(friends);
    });
})
module.exports = router;