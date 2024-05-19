import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { getUploadUrl } from '../fileStorage/attachmentUtils.mjs';
import AWSXRay from 'aws-xray-sdk-core';

const ddbClient = AWSXRay.captureAWSv3Client(new DynamoDB({ region: 'us-east-1' }));
const docClient = DynamoDBDocument.from(ddbClient);
const todosTable = process.env.TODOS_TABLE;
const todosCreatedAtIndex = process.env.TODOS_CREATED_AT_INDEX;

export const TodosAccess = {
    async getAllTodos(userId) {
        const result = await docClient.query({
            TableName: todosTable,
            IndexName: todosCreatedAtIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            },
            ScanIndexForward: false
        });

        return result.Items;
    },

    async createTodo(todoItem) {
        console.log("aaaaaaaa"+todoItem)
        await docClient.put({
            TableName: todosTable,
            Item: todoItem
        });
        return todoItem;
    },

    async updateTodo(userId, todoId, updatedTodo) {
        await docClient.update({
            TableName: todosTable,
            Key: {
                userId,
                todoId
            },
            UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
            ExpressionAttributeNames: {
                '#name': 'name'
            },
            ExpressionAttributeValues: {
                ':name': updatedTodo.name,
                ':dueDate': updatedTodo.dueDate,
                ':done': updatedTodo.done
            },
            ReturnValues: 'ALL_NEW'
        });
        return updatedTodo;
    },

    async deleteTodo(userId, todoId) {
        await docClient.delete({
            TableName: todosTable,
            Key: {
                userId,
                todoId
            }
        });
    },

    async getUploadUrl(todoId) {
        return getUploadUrl(todoId);
    }
};