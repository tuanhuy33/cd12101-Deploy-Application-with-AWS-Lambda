    import { TodosAccess } from '../dataLayer/todoAccess.mjs';
import { v4 as uuidv4 } from 'uuid';

export const createTodo = async (userId, newTodo) => {
    const todoId = uuidv4();
    const createdAt = new Date().toISOString();

    const todoItem = {
        userId,
        todoId,
        createdAt,
        ...newTodo,
        attachmentUrl: `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${todoId}`
    };

    return await TodosAccess.createTodo(todoItem);
};

export const getTodosForUser = async (userId) => {
    return await TodosAccess.getAllTodos(userId);
};

export const updateTodoForUser = async (userId, todoId, updatedTodo) => {
    return await TodosAccess.updateTodo(userId, todoId, updatedTodo);
};

export const deleteTodoForUser = async (userId, todoId) => {
    await TodosAccess.deleteTodo(userId, todoId);
};

export const generateUploadUrl = async (todoId, userId) => {
    return await TodosAccess.getUploadUrl(todoId, userId);
};