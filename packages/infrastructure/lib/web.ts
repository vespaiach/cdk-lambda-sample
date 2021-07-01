import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as s3Deploy from '@aws-cdk/aws-s3-deployment';

interface WebAppProps {
    hostingBucket: s3.IBucket;
    prefix: string;
}

export class Web extends cdk.Construct {
    public readonly webDistribution: cloudfront.CloudFrontWebDistribution;

    constructor(scope: cdk.Construct, id: string, props: WebAppProps) {
        super(scope, `${props.prefix}-${id}`);

        const oai = new cloudfront.OriginAccessIdentity(this, `${props.prefix}-WebHostingOAI`, {});

        this.webDistribution = new cloudfront.CloudFrontWebDistribution(
            this,
            `${props.prefix}-WebAppHostingDistribution`,
            {
                originConfigs: [
                    {
                        s3OriginSource: {
                            s3BucketSource: props.hostingBucket,
                            originAccessIdentity: oai,
                        },
                        behaviors: [{ isDefaultBehavior: true }],
                    },
                ],
                errorConfigurations: [
                    {
                        errorCachingMinTtl: 86400,
                        errorCode: 403,
                        responseCode: 200,
                        responsePagePath: '/index.html',
                    },
                    {
                        errorCachingMinTtl: 86400,
                        errorCode: 404,
                        responseCode: 200,
                        responsePagePath: '/index.html',
                    },
                ],
            }
        );

        props.hostingBucket.grantRead(oai);

        new s3Deploy.BucketDeployment(this, `${props.prefix}-DeployWebsite`, {
            prune: true,
            retainOnDelete: false,
            sources: [s3Deploy.Source.asset('./build')],
            destinationBucket: props.hostingBucket,
        });

        new cdk.CfnOutput(this, 'URL', {
            value: `https://${this.webDistribution.distributionDomainName}/`,
        });
    }
}
