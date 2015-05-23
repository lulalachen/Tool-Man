'use strict';

module.exports = {
	TOKEN_SECRET: process.env.TOKEN_SECRET || 'lulalapoka',
	TOKEN_EXP: 7 * 24 * 60, //minutes
	FB_APPID: process.env.FB_APPID,
	FB_APPSECRET: process.env.FB_APPSECRET,

	// TODO: implement ACL in user model
	MASTER_FB_IDS: [
		"10155564147545285", // lula
		'100001406078788' // kelly
	]
};