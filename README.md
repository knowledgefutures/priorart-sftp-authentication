# SFTP Authentication

This repo provides a .yaml template to be used with AWS CloudFormation. It is based on [this template](https://da02pmi3nq7t1.cloudfront.net/aws-transfer-apig-lambda.cfn.yml) provided by AWS in their [AWS Transfer docs](https://docs.aws.amazon.com/transfer/latest/userguide/authenticating-users.html#authentication-custom-ip).

The customization paramters are `authenticationPath`, `lambdaFunctionS3Bucket`, `lambdaFunctionS3Key`.

To build the lambda trigger, compress `lambda.js` and `node_modules` into a .zip file and place it in an s3 bucket according to the customization parameters `lambdaFunctionS3Bucket/lambdaFunctionS3Key`.

The lambda trigger will send a POST request to the URL listed in `authenticationPath` with the following body

```
{
	serverId: <string>,
	username: <string>,
	password: <string>,
}
```

The route at `authenticationPath` should return a 200 status code for a succesful authentication, and any other status code for a failed authentication.
