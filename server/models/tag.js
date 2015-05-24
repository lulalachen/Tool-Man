// tag.js

'use strict';

var mongoose = require('mongoose')
,	Schema   = mongoose.Schema;


var schema = new Schema({ 
	user_id : { type: String, required: true, sparse: true },
	name : { type: String, required: true, sparse: true },	
	friendList : { type: Array },
	createdAt : { type : Date, default: Date.now }
});
 
var Tag = mongoose.model('Tag', schema);

module.exports = Tag;