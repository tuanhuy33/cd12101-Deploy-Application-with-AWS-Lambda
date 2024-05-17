import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import { deleteTodoForUser } from '../../Blogic/todo.mjs';
import { getUserId } from '../utils.mjs';
import {createLogger} from "../../utils/logger.mjs";

const logger = createLogger('deleteTodo')

const deleteTodoHandler = async (event) => {
  try {
      const userId = getUserId(event);
      const todoId = event.pathParameters.todoId;
      await deleteTodoForUser(userId, todoId);
      return {
          statusCode: 200,
          body: JSON.stringify({
              message: "Todo deleted successfully."
          })
      };
  } catch (error) {
      logger.error(`error: ${error}`)
      return {
        statusCode: 500,
        body: JSON.stringify({
            message: "Error deleting the todo."
        })
    };
}
};

export const handler = middy(deleteTodoHandler)
    .use(httpErrorHandler())
    .use(cors({
        credentials: true
    }));