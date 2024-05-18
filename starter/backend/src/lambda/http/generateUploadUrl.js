import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import { generateUploadUrl } from '../../businessLogic/todo.mjs';
import {createLogger} from "../../utils/logger.mjs";

const logger = createLogger(' generateUploadUrl')

const generateUploadUrlHandler = async (event) => {
    try {
        const userId = getUserId(event);
        const todoId = event.pathParameters.todoId;
        const url = await generateUploadUrl(todoId, userId);
        return {
            statusCode: 200,
            body: JSON.stringify({
                uploadUrl: url
            })
        };
    } catch (error) {
        logger.error(`error: ${error}`)

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Error generating upload URL."
            })
        };
    }
};

export const handler = middy(generateUploadUrlHandler)
    .use(httpErrorHandler())
    .use(cors({
        credentials: true
    }));