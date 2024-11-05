import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import { createTodo } from '../../businessLogic/todos.mjs'
import { getUserId } from '../utils.mjs'
import httpCors from '@middy/http-cors'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('CreateTodo')

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    httpCors({
      credentials: true
    })
  )
  .handler(async (event) => {
    const newTodo = JSON.parse(event.body)
    const userId = getUserId(event)
    const item = await createTodo(userId, newTodo)
    logger.info('Todo created')
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        item: item
      })
    }
  })