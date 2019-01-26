# SFTP Authentication

This repo provides a .yaml template to be used with AWS CloudFormation. It is based on [this template](https://da02pmi3nq7t1.cloudfront.net/aws-transfer-apig-lambda.cfn.yml) provided by AWS in their [AWS Transfer docs](https://docs.aws.amazon.com/transfer/latest/userguide/authenticating-users.html#authentication-custom-ip).

The single customization paramter is `authenticationServer`. A POST requst will be sent to the URL listed in `authenticationServer` with the following body:

```
{
	serverId: <string>,
	username: <string>,
	password: <string>,
}
```

This method should always return HTTP status 200. Any other HTTP status code denotes an error accessing the API.

The response should be of the following form:

```
{
 "Role": "IAM role with configured S3 permissions",
 "PublicKeys": [
     "ssh-rsa public-key1",
     "ssh-rsa public-key2"
  ],
 "Policy": "STS Assume role scope down policy",
 "HomeDirectory": "User's home directory"
}
```