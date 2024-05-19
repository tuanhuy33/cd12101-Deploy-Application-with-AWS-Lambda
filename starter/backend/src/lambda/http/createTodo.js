import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import { createTodo } from '../../businessLogic/todo.mjs';
import { getUserId } from '../utils.mjs';
import {createLogger} from "../../utils/logger.mjs";

const logger = createLogger('createTodo')


const createTodoHandler = async (event) => {
    try {
        const userId = getUserId(event);
        const newTodo = JSON.parse(event.body);
        const createdTodo = await createTodo(newTodo, userId);
        return {
            statusCode: 201,
            body: JSON.stringify({
                item: createdTodo
            })  
        };
    } catch (error) {
        logger.error(`error: ${error}`)
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Error creating the todo item."
            })
        };
    }
};

export const handler = middy(createTodoHandler)
    .use(httpErrorHandler())
    .use(cors({
        credentials: true
}));