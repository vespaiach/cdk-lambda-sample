import * as cdk from '@aws-cdk/core';
import { StorageBucket } from './storage';
import { Web } from './web';

const prefix = process.env.PREFIX || 'cdk_sample';

export class InfrastructureStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const storageBucket = new StorageBucket(this, 'StorageBucket', { prefix });

        new Web(this, 'WebApp', {
            prefix,
            hostingBucket: storageBucket.assetBucket,
        });
    }
}
