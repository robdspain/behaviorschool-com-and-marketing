import fs from 'fs'
import { VertexAI } from '@google-cloud/vertexai'

const writeServiceAccountIfNeeded = () => {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return
  }

  const jsonRaw = process.env.GCP_SERVICE_ACCOUNT_JSON || process.env.GCP_SERVICE_ACCOUNT
  const b64 = process.env.GCP_SERVICE_ACCOUNT_B64 || process.env.GCP_SERVICE_ACCOUNT_BASE64

  if (!jsonRaw && !b64) {
    return
  }

  const json = jsonRaw || Buffer.from(b64 as string, 'base64').toString('utf8')
  const tmpPath = '/tmp/gcp-service-account.json'

  if (!fs.existsSync(tmpPath)) {
    fs.writeFileSync(tmpPath, json)
  }

  process.env.GOOGLE_APPLICATION_CREDENTIALS = tmpPath
}

export const getVertexAI = () => {
  const project = process.env.GCP_PROJECT
  const location = process.env.GCP_LOCATION || 'us-central1'

  if (!project) {
    throw new Error('GCP project not configured')
  }

  writeServiceAccountIfNeeded()

  return new VertexAI({ project, location })
}
