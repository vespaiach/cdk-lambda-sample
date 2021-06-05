const { dbPut, response } = require('./util');

const RESERVED_RESPONSE = `Error: You're using AWS reserved keywords as attributes`;

exports.handler = async (event) => {
    // All log statements are written to CloudWatch
    console.info('received:', event);

    if (event.httpMethod !== 'POST') {
        return response(
            400,
            `Error: Only accepts POST method, you tried "${event.httpMethod}" method.`
        );
    }

    if (!event.body) {
        return response(400, 'Error: Invalid request, you are missing body parameter');
    }

    let body;
    try {
        body = JSON.parse(event.body);
    } catch (parsingError) {
        return response(400, 'Error: Invalid request, wrong body format');
    }

    if (!body.uuid) {
        return response(400, `Error: Missing UUID`);
    }

    try {
        await dbPut(body);
        return response(201);
    } catch (dbError) {
        console.error(dbError);
        const errorResponse =
            dbError.code === 'ValidationException' && dbError.message.includes('reserved keyword')
                ? RESERVED_RESPONSE
                : 'Error: Something wrong in database execution';
        return response(500, errorResponse);
    }
};
