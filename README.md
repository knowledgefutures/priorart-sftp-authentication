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

# Full AWS SFTP Setup
- Create an S3 bucket where SFTP uploads will be stored.
- Create an IAM role `sftpUserRole` that has an attached policy `AmazonS3FullAccess` (this will be scoped down with AWS Transfer). The IAM role must have a trust relationship with `transfer.amazonaws.com`. This role is scoped down with the Policy returned by the response in `lambda.js`.
- Create an IAM role `sftpLoggingRole` that has an attached policy `AWSTransferLoggingAccess`. The IAM role must have a trust relationship with `transfer.amazonaws.com`.
- Deploy the CloudFormation template included in this repo. Ensure that the lambda function .zip is uploaded and available in some s3 bucket (as specified by the path in the CloudFormation template parameters). Name the stack, verify the parameters, and then hit next (leaving other fields as defaults) and then 'Create Stack'.
- Create a Transfer SFTP server. Select 'Custom' under Identity Provider. Find the invocation URL of your CloudFormation-deployed Gateway API. It should have the form: `https://0ow7rwiydh.execute-api.us-east-1.amazonaws.com/prod`. It is critical that the trailing slash is not included in the Identity Provider url. Choose the invocation role created by the CloudFormation template. It should have the term `TransferIdentityProvider` within it.
- Select the `sftpLoggingRole` for the Logging Role.
- Click `Create Server` to finalize, and then connect.