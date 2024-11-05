import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import { getTodos } from '../../businessLogic/todos.mjs'
import { getUserId } from '../utils.mjs'
import httpCors from '@middy/http-cors'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('GetTodos')

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    httpCors({
      credentials: true
    })
  )
  .handler(async (event) => {
    const userId = getUserId(event)
    const todos = await getTodos(userId)
    logger.info('Getting Todo successfully')
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        items: todos
      })
    }
  })