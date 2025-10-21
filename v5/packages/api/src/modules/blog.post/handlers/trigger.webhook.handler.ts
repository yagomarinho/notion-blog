import type { DeployTimer } from '../../../shared/utils/deploy.timer'
import { Handler } from '../../../shared/core/handler'
import { Response } from '../../../shared/core/response'

interface Env {
  timer: DeployTimer
}

export const triggerWebhookHandler = Handler<Env>(
  request =>
    async ({ timer }) => {
      const { body } = request

      const { type, data } = body

      if (
        type === 'page.properties_updated' &&
        data.parent.data_source_id === process.env.NOTION_COLLECTION_ID
      )
        timer.deploy()

      return Response({ status: 201, body: {} })
    },
)
