import * as cdk from '@aws-cdk/core';
import * as s3Deploy from '@aws-cdk/aws-s3-deployment';
import { StorageBucket } from './storage';

export class InfrastructureStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const storageBucket = new StorageBucket(this, 'StorageBucket');

        new s3Deploy.BucketDeployment(this, 'DeployWebsite', {
            prune: true,
            sources: [s3Deploy.Source.asset('./build')],
            destinationBucket: storageBucket.assetBucket,
        });
    }
}
