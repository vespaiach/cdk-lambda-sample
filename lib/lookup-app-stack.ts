import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';
import * as gateway from '@aws-cdk/aws-apigateway';

const stageName = process.env.STAGE_NAME || 'dev';
const allowOrigins = process.env.CORS_ALLOW_ORIGINS || 'http://localhost:8080';

export class LookupAppStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const table = new dynamodb.Table(this, 'StorageKeyValue', {
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            partitionKey: { name: 'uuid', type: dynamodb.AttributeType.STRING },
        });

        const getData = new lambda.Function(this, 'getData', {
            code: lambda.Code.fromAsset('lambda'),
            handler: 'getData.handler',
            runtime: lambda.Runtime.NODEJS_14_X,
            environment: {
                TABLE_NAME: table.tableName,
            },
        });

        const putData = new lambda.Function(this, 'putData', {
            code: lambda.Code.fromAsset('lambda'),
            handler: 'putData.handler',
            runtime: lambda.Runtime.NODEJS_14_X,
            environment: {
                TABLE_NAME: table.tableName,
            },
        });

        table.grantReadData(getData);
        table.grantReadWriteData(putData);

        const apigw = new gateway.RestApi(this, 'lookup-app-api', {
            restApiName: 'Lookup App Service',
            deployOptions: {
                stageName,
            },
            defaultCorsPreflightOptions: {
                allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key'],
                allowMethods: ['OPTIONS', 'GET', 'POST', 'PUT', 'DELETE'],
                allowCredentials: true,
                allowOrigins: allowOrigins.split(','),
            },
        });

        const lookupRes = apigw.root.addResource('lookup');

        lookupRes.addMethod('POST', new gateway.LambdaIntegration(putData));
        lookupRes.addResource('{uuid}').addMethod('GET', new gateway.LambdaIntegration(getData));

        new cdk.CfnOutput(this, 'apiUrl', { value: apigw.url });
    }
}
