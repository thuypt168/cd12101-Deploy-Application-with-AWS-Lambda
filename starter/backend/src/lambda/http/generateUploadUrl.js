import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import { updateAttachmentPresignedUrl } from '../../businessLogic/todos.mjs';
import { getUserId } from '../utils.mjs';
import { createLogger } from '../../utils/logger.mjs';

const logger = createLogger('GenerateUploadUrl')

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true,
    })
  )
  .handler(async (event) => {
    try {
      const todoId = event.pathParameters.todoId;
      const userId = getUserId(event);
      const url = await updateAttachmentPresignedUrl(todoId, userId);
      logger.info('Upload URL generated successfully', { userId, todoId });
      return {
        statusCode: 201,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          uploadUrl: url,
        }),
      };
    } catch (error) {
      logger.info('Generating upload URL error ', { error: error.message });
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          error: 'Unable to generate upload URL',
        }),
      };
    }
  });