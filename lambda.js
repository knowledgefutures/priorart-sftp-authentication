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
	var url = new URL(process.env.authenticationPath);
	var req = https.request({
		method: 'POST',
		hostname: url.hostname,
		path: url.pathname,
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': postData.length
		}
	}, function(res) {
		/* Policy based on the template here: https://docs.aws.amazon.com/transfer/latest/userguide/users-policies-scope-down.html */
		var policy =  `{
			"Version": "2012-10-17",
			"Statement": [
				{
					"Sid": "AllowListingOfUserFolder",
					"Action": [
						"s3:ListBucket"
					],
					"Effect": "Allow",
					"Resource": [
						"arn:aws:s3:::${process.env.homeDirectoryBucket}"
					],
					"Condition": {
						"StringLike": {
							"s3:prefix": [
								"${event.username}/*",
								"${event.username}"
							]
						}
					}
				},
				{
					"Sid": "AWSTransferRequirements",
					"Effect": "Allow",
					"Action": [
						"s3:ListAllMyBuckets",
						"s3:GetBucketLocation"
					],
					"Resource": "*"
				},
				{
					"Sid": "HomeDirObjectAccess",
					"Effect": "Allow",
					"Action": [
						"s3:PutObject",
						"s3:GetObject",
						"s3:DeleteObjectVersion",
						"s3:DeleteObject",
						"s3:GetObjectVersion"
					],
					"Resource": "arn:aws:s3:::${process.env.homeDirectoryBucket}/${event.username}/*"
				}
			]
		}`;
		var response = res.statusCode === 200
			? {
				Role: 'arn:aws:iam::941578828947:role/sftpUserRole',
				Policy: policy,
				HomeDirectory: `/${process.env.homeDirectoryBucket}/${event.username}`
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
