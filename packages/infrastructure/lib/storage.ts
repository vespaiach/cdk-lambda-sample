import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';

export class StorageBucket extends cdk.Construct {
    public readonly assetBucket: s3.IBucket;

    constructor(scope: cdk.Construct, id: string) {
        super(scope, id);

        this.assetBucket = new s3.Bucket(this, 'AssetBucket', {
            encryption: s3.BucketEncryption.S3_MANAGED,
        });
    }
}
