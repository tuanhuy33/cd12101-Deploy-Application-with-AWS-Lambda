import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import { getTodosForUser } from '../../businessLogic/todo.mjs';
import { getUserId } from '../utils.mjs';
import {createLogger} from "../../utils/logger.mjs";

const logger = createLogger('getTodos')

const getTodosHandler = async (event) => {
    try {
        const userId = getUserId(event);
        logger.info(`userId: ${userId}`)
        const todos = await getTodosForUser(userId);
        logger.info(`todos: ${todos}`)

        return {
            statusCode: 200,
            body: JSON.stringify({
                items: todos
            })
        };
    } catch (error) {
        logger.info(`error: ${error}`)

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Error getting the todos."
            })
        };
    }
};

export const handler = middy(getTodosHandler)
    .use(httpErrorHandler())
    .use(cors({
        credentials: true
    }));