var express = require('express'),
	router = express.Router(),
	mongoose = require('mongoose'),
	User = mongoose.model('User');


router.get('/',function(req,res) { 
	User.find(function(err, users){
		res.send(users)
	})
});

module.exports = router;