const cdk = require('@aws-cdk/core');
const dynamo = require('@aws-cdk/aws-dynamodb');
const lambda = require('@aws-cdk/aws-lambda');
const apigateway = require('@aws-cdk/aws-apigateway');

const allowOrigins = process.env.CORS_ALLOW_ORIGINS;

class GeneralApiStack extends cdk.Stack {
    /**
     *
     * @param {cdk.Construct} scope
     * @param {string} id
     * @param {cdk.StackProps=} props
     */
    constructor(scope, id, props) {
        super(scope, id, props);

        // The code that defines your stack goes here
        const dynamoTable = new dynamo.Table(this, 'GeneralApi', {
            billingMode: dynamo.BillingMode.PAY_PER_REQUEST,
            partitionKey: {
                name: 'id',
                type: dynamo.AttributeType.STRING,
            },
            tableName: 'gen_api',
        });

        const getItem = new lambda.Function(this, 'getItem', {
            functionName: 'general-api-getItem',
            description: 'Retrieve item information',
            code: new lambda.AssetCode('lambda'),
            handler: 'get-item.handler',
            runtime: lambda.Runtime.NODEJS_14_X,
            environment: {
                TABLE_NAME: dynamoTable.tableName,
            },
        });

        const putItem = new lambda.Function(this, 'putItem', {
            functionName: 'general-api-putItem',
            description: 'Save item information',
            code: new lambda.AssetCode('api'),
            handler: 'put-item.handler',
            runtime: lambda.Runtime.NODEJS_14_X,
            environment: {
                TABLE_NAME: dynamoTable.tableName,
            },
        });

        const delItem = new lambda.Function(this, 'delItem', {
            functionName: 'general-api-delItem',
            description: 'Delete item information',
            code: new lambda.AssetCode('api'),
            handler: 'del-item.handler',
            runtime: lambda.Runtime.NODEJS_14_X,
            environment: {
                TABLE_NAME: dynamoTable.tableName,
            },
        });

        dynamoTable.grantReadData(getItem);
        dynamoTable.grantReadWriteData(putItem);
        dynamoTable.grantReadWriteData(delItem);

        const api = new apigateway.RestApi(this, 'general-api', {
            restApiName: 'General Api Service',
            defaultCorsPreflightOptions: {
                allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key'],
                allowMethods: ['OPTIONS', 'GET', 'POST', 'PUT', 'DELETE'],
                allowCredentials: true,
                allowOrigins: allowOrigins.split(','),
            },
        });

        const genRes = api.root.addResource('gen');
        genRes.addMethod('POST', new apigateway.LambdaIntegration(putItem));
        genRes.addResource('{id}').addMethod('GET', new apigateway.LambdaIntegration(getItem));
        genRes.addResource('{id}').addMethod('DELETE', new apigateway.LambdaIntegration(delItem));
    }
}

module.exports = { GeneralApiStack };