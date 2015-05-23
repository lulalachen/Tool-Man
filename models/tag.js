// tag.js

'use strict';

var mongoose = require('mongoose')
,	Schema   = mongoose.Schema;


var schema = new Schema({ 
	user_id : { type: Schema.Types.ObjectId, required: true },
	tagName : { type: String, required: true },	
	friendList : { type: Array },
	createdAt : { type : Date, required: true, default: Date.now }
});
 
var Tag = mongoose.model('Tag', schema);

module.exports = Tag;