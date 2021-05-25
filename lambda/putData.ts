import { put } from '../dynamoDB/db';
import { EventSource } from '../types';

const RESERVED_RESPONSE = `Error: You're using AWS reserved keywords as attributes`;

export const handler = async (event: EventSource) => {
    if (!event.body) {
        return { statusCode: 400, body: 'Error: Invalid request, you are missing body parameter' };
    }

    let body;
    try {
        body = JSON.parse(event.body);
    } catch (parsingError) {
        return { statusCode: 400, body: 'Error: Invalid request, wrong body format' };
    }

    if (!body.uuid) {
        return { statusCode: 400, body: 'Error: Invalid request, you are missing UUID' };
    }

    try {
        await put(body);
        return { statusCode: 201, body: '' };
    } catch (dbError) {
        console.error(dbError);
        const errorResponse =
            dbError.code === 'ValidationException' && dbError.message.includes('reserved keyword')
                ? RESERVED_RESPONSE
                : "Error: couldn't update database";
        return { statusCode: 500, body: errorResponse };
    }
};
