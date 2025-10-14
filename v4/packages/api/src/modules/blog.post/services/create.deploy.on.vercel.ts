/* eslint-disable no-console */
import { Vercel } from '@vercel/sdk'

export async function createDeployOnVercel() {
  const vercel = new Vercel({
    bearerToken: process.env.VERCEL_API_TOKEN,
  })

  try {
    const createResponse = await vercel.deployments.createDeployment({
      requestBody: {
        name: process.env.VERCEL_PROJECT_NAME!,
        project: process.env.VERCEL_PROJECT_ID!,
        target: process.env.VERCEL_TARGET!,
        gitSource: {
          type: process.env.VERCEL_SOURCE_TYPE! as any,
          org: process.env.VERCEL_SOURCE_ORG!,
          repo: process.env.VERCEL_SOURCE_REPO!,
          ref: process.env.VERCEL_SOURCE_REF! as any,
        },
      },
    })

    console.log(
      `Deployment created: ID ${createResponse.id} and status ${createResponse.status}`,
    )
  } catch (error) {
    console.error(
      error instanceof Error ? `Error: ${error.message}` : String(error),
    )
  }
}
