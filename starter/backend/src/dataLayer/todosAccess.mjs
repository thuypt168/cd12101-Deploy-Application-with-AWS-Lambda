import AWS from 'aws-sdk';
import AWSXRay from 'aws-xray-sdk-core';
import { createLogger } from '../utils/logger.mjs';

const logger = createLogger("TodosAccess");
const XAWS = AWSXRay.captureAWS(AWS);

const s3_bucket_name = process.env.ATTACHMENT_S3_BUCKET;

export class TodosAccess {
    constructor(
        docClient = new XAWS.DynamoDB.DocumentClient(),
        todosTable = process.env.TODOS_TABLE,
        todosIndex = process.env.TODOS_CREATED_AT_INDEX,
        bucket_name = s3_bucket_name
    ) {
        this.docClient = docClient;
        this.todosTable = todosTable;
        this.todosIndex = todosIndex;
        this.bucket_name = bucket_name;
    }
  
    async getAllTodoItems(userId) {
        logger.info("Getting all todos");
        try {
            const result = await this.docClient
            .query({
                TableName: this.todosTable,
                IndexName: this.todosIndex,
                KeyConditionExpression: "userId = :userId",
                ExpressionAttributeValues: {
                    ":userId": userId
                },
                ScanIndexForward: true,
            })
            .promise();
            return result.Items;
        } catch (error) {
            throw Error(error);
        }
    }

    async createTodoItem(item) {
        logger.info("Creating a new todo");
        try {
            await this.docClient
            .put({
                TableName: this.todosTable,
                Item: item
            })
            .promise();
            return item;
        } catch (error) {
            throw Error(error);
        }
    }
  
    async updateTodoItem(todoId, userId, updateToDo) {
        logger.info(`Updating todo item ${todoId} in ${this.todosTable}`);
        try {
            await this.docClient
            .update({
                TableName: this.todosTable,
                Key: {
                    todoId,
                    userId,
                },
                UpdateExpression: "set #name = :name, #dueDate = :dueDate, #done = :done",
                ExpressionAttributeNames: {
                    "#name": "name",
                    "#dueDate": "dueDate",
                    "#done": "done",
                },
                ExpressionAttributeValues: {
                    ":name": updateToDo.name,
                    ":dueDate": updateToDo.dueDate,
                    ":done": updateToDo.done,
                },
                ReturnValues: "UPDATED_NEW",
            })
            .promise();
            return updateToDo;
        } catch (error) {
            throw Error(error);
        }
    }   
  
    async deleteTodoItem(userId, todoId) {
        logger.info(`Deleting todo item ${todoId} from ${this.todosTable}`);
        try {
            await this.docClient
            .delete({
                TableName: this.todosTable,
                Key: {
                    userId,
                    todoId,
                },
            })
            .promise();
            return "Delete";
        } catch (error) {
            throw Error(error)
        }
    }

    async updateUrl(todoId, userId, attachmentUrl) {
        logger.info(`Updating image url for a todo item: ${ todoId }`);
        try {
            await this.docClient
            .update({
                TableName: this.todosTable,
                Key: {
                    todoId,
                    userId,
                },
                UpdateExpression: "set attachmentUrl = :attachmentUrl",
                ExpressionAttributeValues: {
                    ":attachmentUrl": attachmentUrl,
                },
            })
            .promise();
            logger.info(`Updating image url: ${ attachmentUrl }`);
            return attachmentUrl;
        } catch (error) {
            throw Error(error)
        }
    }

}