const { dbDel, response } = require('./util');

exports.handler = async (event) => {
    // All log statements are written to CloudWatch
    console.info('received:', event);

    if (event.httpMethod !== 'DELETE') {
        return response(
            400,
            `Error: Only accepts DELETE' method, you tried "${event.httpMethod}" method.`
        );
    }

    const id = event.pathParameters.uuid;
    if (!id) {
        return response(400, `Error: You are missing parameter UUID`);
    }

    try {
        await dbDel(id);
        return response(201);
    } catch (dbError) {
        console.error(dbError);
        return response(500, 'Error: something wrong in database execution');
    }
};
