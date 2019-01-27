'use strict';
var https = require('https');
var SHA3 = require('crypto-js/sha3');
var encHex = require('crypto-js/enc-hex');
var { URL } = require('url');

exports.handler = (event, context, callback) => {
	var postData = JSON.stringify({
	    serverId: event.serverId,
	    slug: event.username,
	    password: SHA3(event.password).toString(encHex),
	});
	const url = new URL(process.env.authenticationPath);
	var req = https.request({
		method: 'POST',
		hostname: url.hostname,
		path: url.pathname,
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': postData.length
		}
	}, function(res) {
		const response = res.statusCode === 200
			? {
				Role: 'arn:aws:iam::941578828947:role/sftpUserRole',
				Policy: 'arn:aws:iam::941578828947:policy/sftpScopeDownPolicy',
				HomeDirectory: event.username
			}
			: {};
		callback(null, response);
	});
	req.write(postData);
	req.on('error', function(err) {
		console.error(err);
		callback(null, {});
	});
	req.end();
};
