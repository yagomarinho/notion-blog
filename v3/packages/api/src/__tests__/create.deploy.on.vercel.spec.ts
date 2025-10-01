import { createDeployOnVercel } from '../services/create.deploy.on.vercel'
import { Vercel } from '@vercel/sdk'

jest.mock('@vercel/sdk', () => {
  const createDeployment = jest.fn()
  const MockVercel = jest.fn().mockImplementation(() => ({
    deployments: { createDeployment },
  }))

  ;(MockVercel as any).__createDeployment = createDeployment
  return { Vercel: MockVercel }
})

export const vercelSdkMock = (Vercel as unknown as any)
  .__createDeployment as jest.Mock

describe('create deploy on vercel', () => {
  const OLD_ENV = process.env
  let logSpy: jest.SpyInstance
  let errSpy: jest.SpyInstance

  beforeEach(() => {
    jest.clearAllMocks()
    process.env = { ...OLD_ENV }

    process.env.VERCEL_API_TOKEN = 'vercel-token'
    process.env.VERCEL_PROJECT_NAME = 'my-app'
    process.env.VERCEL_PROJECT_ID = 'prj_123'
    process.env.VERCEL_TARGET = 'production'
    process.env.VERCEL_SOURCE_TYPE = 'github'
    process.env.VERCEL_SOURCE_ORG = 'acme'
    process.env.VERCEL_SOURCE_REPO = 'site'
    process.env.VERCEL_SOURCE_REF = 'main'

    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    errSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    logSpy.mockRestore()
    errSpy.mockRestore()
  })

  afterAll(() => {
    process.env = OLD_ENV
  })

  it('create a deploy on vercel', async () => {
    vercelSdkMock.mockResolvedValueOnce({ id: 'dep_123', status: 'READY' })

    await createDeployOnVercel()

    expect(Vercel).toHaveBeenCalledWith({ bearerToken: 'vercel-token' })
    expect(vercelSdkMock).toHaveBeenCalledWith({
      requestBody: {
        name: 'my-app',
        project: 'prj_123',
        target: 'production',
        gitSource: {
          type: 'github' as any,
          org: 'acme',
          repo: 'site',
          ref: 'main' as any,
        },
      },
    })
    expect(logSpy).toHaveBeenCalledWith(
      'Deployment created: ID dep_123 and status READY',
    )
  })

  it('log a vercel exception', async () => {
    vercelSdkMock.mockRejectedValueOnce(new Error('error'))

    await createDeployOnVercel()

    expect(errSpy).toHaveBeenCalledWith('Error: error')
  })

  it('log a string vercel exceptinon', async () => {
    vercelSdkMock.mockRejectedValueOnce('oops')

    await createDeployOnVercel()

    expect(errSpy).toHaveBeenCalledWith('oops')
  })
})
