import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import { updateTodoForUser } from '../../Blogic/todo.mjs';
import { getUserId } from '../utils.mjs';
import {createLogger} from "../../utils/logger.mjs";
const logger = createLogger(' updateTodo')

const updateTodoHandler = async (event) => {
    try {
        const userId = getUserId(event);
        const todoId = event.pathParameters.todoId;
        const updatedData = JSON.parse(event.body);
        await updateTodoForUser(userId, todoId, updatedData);
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Todo updated successfully."
            })
        };
    } catch (error) {
        logger.error(`error: ${error}`)

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Error updating the todo."
            })
        };
    }
};

export const handler = middy(updateTodoHandler)
    .use(httpErrorHandler())
    .use(cors({
        credentials: true
}));