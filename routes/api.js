var express = require('express');
var router = express.Router();

var tag = require('./apis/tag'),
	token = require('./apis/token'),
	user = require('./apis/user');

router.use('/tag', tag);
router.use('/token', token);
router.use('/user', user);


module.exports = router;
