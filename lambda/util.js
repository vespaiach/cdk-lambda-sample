const AWS = require('aws-sdk');

const db = new AWS.DynamoDB.DocumentClient();
const TableName = process.env.TABLE_NAME;

exports.dbGet = (uuid) =>
    db
        .get({
            TableName,
            Key: { uuid },
        })
        .promise();

exports.dbPut = (Item) =>
    db
        .put({
            TableName,
            Item,
        })
        .promise();

exports.dbDel = (uuid) =>
    db
        .delete({
            TableName,
            Key: { uuid },
        })
        .promise();

exports.response = (statusCode, message, headers = {}) => {
    const result = { statusCode, headers };

    switch (typeof message) {
        case 'string':
            result.body = message;
            return result;
        case 'object':
        case 'boolean':
        case 'number':
            result.body = JSON.stringify(message);
            return result;
        default:
            return result;
    }
};
