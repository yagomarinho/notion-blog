import { Middleware } from '../../../shared/core/middleware'
import { Next } from '../../../shared/core/next'
import { Response } from '../../../shared/core/response'
import { verifySignature } from '../../../shared/utils/verify.signature'

export const verifySignatureMiddleware = Middleware(
  request => async (): Promise<any> => {
    const { body } = request
    const sign =
      request.headers['X-Notion-Signature'] ||
      request.headers['x-notion-signature']

    if (
      !sign ||
      typeof sign !== 'string' ||
      !verifySignature(
        sign,
        process.env.NOTION_WEBHOOK_TOKEN ?? '',
        JSON.stringify(body),
      )
    )
      return Response({
        status: 401,
        body: { message: 'Unauthorized request' },
      })

    return Next({ request })
  },
)
