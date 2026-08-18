import { getBufferApiKey, getBufferChannelId, getBufferWorkspace } from './buffer-workspaces'

type BufferChannel = {
  id: string
  name: string
  service: string
}

type BehaviorSchoolChannelConfig = {
  id: string
  name: string
  service: string
}

type BufferPostResult = {
  provider: 'buffer'
  status: 'queued_in_buffer'
  postId: string
  dueAt: string | null
  channelId: string
  channelName: string
  service: string
}

type BufferPostInput = {
  platform: string
  text: string
  scheduledAt: string
  asset?: string | null
}

const BUFFER_API_URL = 'https://api.buffer.com'

const platformService: Record<string, string> = {
  linkedin: 'linkedin',
  'linkedin post': 'linkedin',
  facebook: 'facebook',
  'facebook post': 'facebook',
  instagram: 'instagram',
  'instagram post': 'instagram',
  youtube: 'youtube',
  'youtube video': 'youtube',
  x: 'twitter',
  twitter: 'twitter',
  bluesky: 'bluesky',
}

function readChannelConfig() {
  return getBufferWorkspace('behaviorschool').channels
    .map((channel) => ({
      id: getBufferChannelId('behaviorschool', channel.platform),
      name: channel.label,
      service: channel.platform,
    }))
    .filter((channel) => channel.id)
}

function assertBehaviorSchoolChannel(channel: BufferChannel, expected: BehaviorSchoolChannelConfig) {
  const identity = `${channel.name} ${channel.service}`.toLowerCase()
  if (/rob\s*spain|robspain/.test(identity)) {
    throw new Error(`Refusing to publish to a Rob Spain channel: ${channel.name}.`)
  }

  if (
    channel.id !== expected.id ||
    channel.name !== expected.name ||
    channel.service !== expected.service
  ) {
    throw new Error(
      `Buffer channel identity changed for ${expected.name}. Expected ${expected.service}/${expected.id}; received ${channel.service}/${channel.id}.`,
    )
  }
}

async function bufferRequest<T>(query: string, variables?: Record<string, unknown>) {
  const apiKey = getBufferApiKey('behaviorschool')
  if (!apiKey) throw new Error('BUFFER_BEHAVIORSCHOOL_API_KEY is not configured.')

  const response = await fetch(BUFFER_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  })
  const payload = (await response.json().catch(() => ({}))) as {
    data?: T
    errors?: Array<{ message?: string }>
  }

  if (!response.ok || payload.errors?.length) {
    throw new Error(payload.errors?.map((error) => error.message).filter(Boolean).join('; ') || `Buffer API returned ${response.status}.`)
  }

  return payload.data as T
}

function serviceForPlatform(platform: string) {
  return platformService[platform.trim().toLowerCase()] || null
}

export function isBehaviorSchoolBufferConfigured() {
  if (!getBufferApiKey('behaviorschool')) {
    return false
  }

  return readChannelConfig().length > 0
}

export function bufferSupportsPlatform(platform: string) {
  return Boolean(serviceForPlatform(platform))
}

export async function publishToBehaviorSchoolBuffer(input: BufferPostInput): Promise<BufferPostResult> {
  const service = serviceForPlatform(input.platform)
  if (!service) {
    throw new Error(`${input.platform} requires a reviewed media workflow before it can be sent to Buffer automatically.`)
  }

  const organizationId = process.env.BUFFER_BEHAVIORSCHOOL_ORGANIZATION_ID?.trim()
  if (!organizationId) throw new Error('BUFFER_BEHAVIORSCHOOL_ORGANIZATION_ID is not configured.')

  const configuredChannels = readChannelConfig()
  const expected = configuredChannels.find((channel) => channel.service === service)
  if (!expected) {
    throw new Error(`No approved Behavior School Buffer channel is configured for ${service}.`)
  }

  const channelData = await bufferRequest<{ channels: BufferChannel[] }>(
    `query GetBehaviorSchoolChannels($organizationId: String!) {
      channels(input: { organizationId: $organizationId }) {
        id
        name
        service
      }
    }`,
    { organizationId },
  )
  const channel = channelData.channels.find((candidate) => candidate.id === expected.id)
  if (!channel) throw new Error(`The approved Behavior School ${service} channel is not connected in Buffer.`)
  assertBehaviorSchoolChannel(channel, expected)

  const result = await bufferRequest<{
    createPost: {
      post?: { id: string; dueAt?: string | null }
      message?: string
    }
  }>(
    `mutation QueueBehaviorSchoolPost($input: CreatePostInput!) {
      createPost(input: $input) {
        ... on PostActionSuccess {
          post {
            id
            dueAt
          }
        }
        ... on MutationError {
          message
        }
      }
    }`,
    {
      input: {
        text: input.text,
        channelId: channel.id,
        schedulingType: 'automatic',
        mode: 'addToQueue',
      },
    },
  )

  const post = result.createPost.post
  if (!post?.id) throw new Error(result.createPost.message || 'Buffer did not return a queued post.')

  return {
    provider: 'buffer',
    status: 'queued_in_buffer',
    postId: post.id,
    dueAt: post.dueAt || null,
    channelId: channel.id,
    channelName: channel.name,
    service: channel.service,
  }
}
