/* eslint-disable no-console */
import { createDeployOnVercel } from '../services/create.deploy.on.vercel'

const DEFAULT_TIME = Number(
  process.env.DEFAULT_TIME_DEPLOY_CLOCK || 5 * 60 * 1000, // 5 minutos
)

enum TIMER_STATUS {
  READY,
  SCHEDULED,
}

export function DeployTimer(time = DEFAULT_TIME) {
  let status = TIMER_STATUS.READY

  // eslint-disable-next-line no-undef
  let timeout: NodeJS.Timeout

  function deploy() {
    if (status === TIMER_STATUS.SCHEDULED) clear()
    status = TIMER_STATUS.SCHEDULED

    timeout = setTimeout(async () => {
      await createDeployOnVercel()
      status = TIMER_STATUS.READY

      console.log('Deploy on Vercel Queued')
    }, time)

    console.log('Deploy on Vercel Scheduled')
  }

  function clear() {
    status = TIMER_STATUS.READY
    clearTimeout(timeout)
  }

  return {
    deploy,
    clear,
  }
}
