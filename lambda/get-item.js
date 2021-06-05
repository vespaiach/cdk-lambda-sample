const { dbGet, response } = require('./util');

exports.handler = async (event) => {
    // All log statements are written to CloudWatch
    console.info('received:', event);

    if (event.httpMethod !== 'GET') {
        return response(
            400,
            `Error: Only accepts GET method, you tried "${event.httpMethod}" method.`
        );
    }

    const id = event.pathParameters.uuid;
    if (!id) {
        return response(400, `Error: You are missing parameter UUID`);
    }

    try {
        const result = await dbGet(id);
        if (result && result.Item) {
            return response(200, result.Item, { 'Access-Control-Allow-Origin': '*' });
        } else {
            return response(404, `Error: Not found item with id: "${id}"`);
        }
    } catch (dbError) {
        console.error(dbError);
        return response(500, 'Error: something wrong in database execution');
    }
};
