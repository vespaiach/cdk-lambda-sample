import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';
import * as gateway from '@aws-cdk/aws-apigateway';
export class LookupAppStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const table = new dynamodb.Table(this, 'StorageKeyValue', {
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            sortKey: { name: 'noteId', type: dynamodb.AttributeType.STRING },
            partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
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
        });

        const res = apigw.root.addResource('lookup');
        res.addMethod('GET', new gateway.LambdaIntegration(getData));
        res.addMethod('POST', new gateway.LambdaIntegration(putData));
    }
}
