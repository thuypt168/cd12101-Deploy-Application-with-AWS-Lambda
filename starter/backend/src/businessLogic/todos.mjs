import * as uuid from 'uuid';
import { TodosAccess } from "../dataLayer/todosAccess.mjs";
import { AttachmentUtils } from '../fileStorage/attachmentUtils.mjs';
import { createLogger } from '../utils/logger.mjs';

const logger = createLogger("Todos");
const todosAccess = new TodosAccess();
const attachmentUtils = new AttachmentUtils();

export async function getTodos(userId) {
  try {
    logger.info("Getting todos for user:", { userId });
    return await todosAccess.getAllTodoItems(userId);
  } catch (error) {
    logger.error("Getting todos error:", { userId, error });
    throw error;
  }
}

export async function createTodo(userId, createTodo) {
  try {
    logger.info("Creating a new todo for user:", { userId });
    const todoId = uuid.v4();
    const createdAt = new Date().toISOString();
    const todo = {
      todoId: todoId,
      userId: userId,
      createdAt,
      done: false,
      attachmentUrl: null,
      name: createTodo.name,
      dueDate: createTodo.dueDate
    };
    return await todosAccess.createTodoItem(todo);
  } catch (error) {
    logger.error("Creating todo error:", { userId, error });
    throw error;
  }
}

export async function updateTodo(todoId, userId, updateToDo) {
  try {
    logger.info("Updating a todo:", { userId, todoId });
    return await todosAccess.updateTodoItem(todoId, userId, updateToDo);
  } catch (error) {
    logger.error("Updating todo error:", { userId, todoId, error });
    throw error;
  }
}

export async function deleteTodo(userId, todoId) {
  try {
    logger.info("Deleting a todo:", { userId, todoId });
    return await todosAccess.deleteTodoItem(userId, todoId);
  } catch (error) {
    logger.error("Deleting todo error:", { userId, todoId, error });
    throw error;
  }
}

export async function updateAttachmentPresignedUrl(todoId, userId, attachmentUrl) {
  try {
    logger.info("Updating attachment presigned URL:", { userId, todoId });
    return await todosAccess.updateUrl(todoId, userId, attachmentUrl);
  } catch (error) {
    logger.error("Updating attachment presigned URL error :", { userId, todoId, error });
    throw error;
  }
}