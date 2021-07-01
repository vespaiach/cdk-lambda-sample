import * as cdk from '@aws-cdk/core';
import * as s3Deploy from '@aws-cdk/aws-s3-deployment';
import * as s3 from '@aws-cdk/aws-s3';

export class InfrastructureStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const webBucket = new s3.Bucket(this, 'WebBucket', {
            encryption: s3.BucketEncryption.S3_MANAGED,
        });

        new s3Deploy.BucketDeployment(this, 'DeployWebsite', {
            prune: true,
            sources: [s3Deploy.Source.asset('./build')],
            destinationBucket: webBucket,
            destinationKeyPrefix: 'web/static', // optional prefix in destination bucket
        });
    }
}
