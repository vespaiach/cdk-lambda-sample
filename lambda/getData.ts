import { get } from '../dynamoDB/db';
import { EventSource } from '../types';

export const handler = async (event: EventSource) => {
    const uuid = event.pathParameters.uuid;
    if (!uuid) {
        return { statusCode: 400, body: `Error: You are missing parameter UUID` };
    }

    try {
        const response = await get(uuid);
        return { statusCode: 200, body: JSON.stringify(response.Item) };
    } catch (dbError) {
        console.error(dbError);
        return { statusCode: 500, body: 'Error: Something wrong. Please try later' };
    }
};
