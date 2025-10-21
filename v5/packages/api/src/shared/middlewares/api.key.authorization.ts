import { Middleware } from '../core/middleware'
import { Next } from '../core/next'
import { Response } from '../core/response'

export const apiKeyAuthorization = Middleware(
  request => async (): Promise<any> => {
    const auth = request.headers.authorization

    if (!auth)
      return Response({
        status: 401,
        body: { message: 'API Access Token is missing' },
      })

    const [, token] = auth.split(' ')

    if (!token)
      return Response({
        status: 401,
        body: { message: 'API Access Token is missing' },
      })

    if (token !== process.env.API_ACCESS_TOKEN)
      return Response({
        status: 401,
        body: { message: 'API Access Token is invalid' },
      })

    return Next({ request })
  },
)
