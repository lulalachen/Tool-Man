// user.js

'use strict';

var mongoose = require('mongoose')
,	Schema   = mongoose.Schema;


var schema = new Schema({ 
	createdAt : { type : Date, required: true, default : Date.now },
	fbId : { type: String },
	email : { type: String },
	name : { type: String },
	tags : Array
});
 
var User = mongoose.model('User', schema);

module.exports = User;