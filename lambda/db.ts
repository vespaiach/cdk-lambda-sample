import { DynamoDB } from 'aws-sdk';

const db = new DynamoDB.DocumentClient();
const TableName = process.env.TABLE_NAME as string;

export const get = (uuid: string) =>
    db
        .get({
            TableName,
            Key: { uuid },
        })
        .promise();

export const put = (params: Record<string, unknown>) =>
    db
        .put({
            TableName,
            Item: params,
        })
        .promise();
