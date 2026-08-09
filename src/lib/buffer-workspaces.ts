export type BufferBrand = 'robspain' | 'behaviorschool'
export type BufferPlatform = 'linkedin' | 'facebook' | 'instagram' | 'youtube'

type ChannelDefinition = {
  platform: BufferPlatform
  label: string
  channelIdEnv: string
  expectedChannelId?: string
}

type WorkspaceDefinition = {
  brand: BufferBrand
  label: string
  accountLabel: string
  apiKeyEnv: string
  channels: ChannelDefinition[]
}

// Keep the two Buffer accounts separate. A generic API key or unlabelled
// channel ID is never used because it cannot prove which brand should publish.
export const BUFFER_WORKSPACES: WorkspaceDefinition[] = [
  {
    brand: 'robspain',
    label: 'RobSpain.com',
    accountLabel: 'Rob Spain Buffer workspace',
    apiKeyEnv: 'BUFFER_ROBSPAIN_API_KEY',
    channels: [
      { platform: 'linkedin', label: 'Rob Spain LinkedIn', channelIdEnv: 'BUFFER_ROBSPAIN_LINKEDIN_CHANNEL_ID' },
      { platform: 'facebook', label: 'Rob Spain, BCBA, IBA Facebook', channelIdEnv: 'BUFFER_ROBSPAIN_FACEBOOK_CHANNEL_ID' },
      { platform: 'instagram', label: 'Rob Spain Instagram', channelIdEnv: 'BUFFER_ROBSPAIN_INSTAGRAM_CHANNEL_ID' },
      { platform: 'youtube', label: 'Rob Spain YouTube', channelIdEnv: 'BUFFER_ROBSPAIN_YOUTUBE_CHANNEL_ID' },
    ],
  },
  {
    brand: 'behaviorschool',
    label: 'BehaviorSchool.com',
    accountLabel: 'Behavior School Products Buffer workspace',
    apiKeyEnv: 'BUFFER_BEHAVIORSCHOOL_API_KEY',
    channels: [
      { platform: 'facebook', label: 'Behavior School Facebook Page', channelIdEnv: 'BUFFER_BEHAVIORSCHOOL_FACEBOOK_CHANNEL_ID', expectedChannelId: '6a73be9f99afb443490c8753' },
      { platform: 'instagram', label: 'behavior.school Instagram', channelIdEnv: 'BUFFER_BEHAVIORSCHOOL_INSTAGRAM_CHANNEL_ID', expectedChannelId: '6a73bf3399afb443490c8916' },
      { platform: 'youtube', label: 'Behavior School YouTube', channelIdEnv: 'BUFFER_BEHAVIORSCHOOL_YOUTUBE_CHANNEL_ID', expectedChannelId: '6a74bbc899afb443491344d2' },
    ],
  },
]

export type BufferChannelStatus = 'configured' | 'missing' | 'mismatch'
export type BufferApiStatus = 'verified' | 'missing' | 'invalid'

export function getBufferWorkspace(brand: BufferBrand) {
  return BUFFER_WORKSPACES.find((workspace) => workspace.brand === brand)!
}

export function getBufferApiKey(brand: BufferBrand) {
  return process.env[getBufferWorkspace(brand).apiKeyEnv]?.trim() || ''
}

export function getBufferChannelId(brand: BufferBrand, platform: BufferPlatform) {
  const channel = getBufferWorkspace(brand).channels.find((item) => item.platform === platform)
  return channel ? process.env[channel.channelIdEnv]?.trim() || '' : ''
}

export function getBufferWorkspaceStatus() {
  const legacyApiKeyDetected = Boolean(process.env.BUFFER_API_KEY?.trim())

  return BUFFER_WORKSPACES.map((workspace) => ({
    brand: workspace.brand,
    label: workspace.label,
    accountLabel: workspace.accountLabel,
    apiKeyEnv: workspace.apiKeyEnv,
    apiKeyConfigured: Boolean(getBufferApiKey(workspace.brand)),
    legacyApiKeyDetected,
    channels: workspace.channels.map((channel) => {
      const channelId = process.env[channel.channelIdEnv]?.trim() || ''
      const status: BufferChannelStatus = !channelId
        ? 'missing'
        : channel.expectedChannelId && channelId !== channel.expectedChannelId
          ? 'mismatch'
          : 'configured'
      return {
        platform: channel.platform,
        label: channel.label,
        channelIdEnv: channel.channelIdEnv,
        expectedChannelId: channel.expectedChannelId,
        status,
      }
    }),
  }))
}

export async function getBufferWorkspaceHealth() {
  const workspaces = getBufferWorkspaceStatus()

  return Promise.all(workspaces.map(async (workspace) => {
    const apiKey = getBufferApiKey(workspace.brand)
    if (!apiKey) return { ...workspace, apiStatus: 'missing' as BufferApiStatus }

    try {
      const response = await fetch('https://api.buffer.com', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: '{ account { id name email } }',
        }),
        signal: AbortSignal.timeout(8000),
      })
      if (!response.ok) return { ...workspace, apiStatus: 'invalid' as BufferApiStatus }

      const body = await response.json() as { data?: { account?: { id?: string; name?: string; email?: string } }; errors?: unknown[] }
      const account = body.data?.account
      if (body.errors?.length || !account?.id) return { ...workspace, apiStatus: 'invalid' as BufferApiStatus }

      return {
        ...workspace,
        apiStatus: 'verified' as BufferApiStatus,
        bufferAccountName: account.name || null,
        bufferAccountEmail: account.email || null,
      }
    } catch {
      return { ...workspace, apiStatus: 'invalid' as BufferApiStatus }
    }
  }))
}

export async function createBufferDraft(input: {
  brand: BufferBrand
  platform: BufferPlatform
  text: string
}) {
  const workspace = getBufferWorkspace(input.brand)
  const apiKey = getBufferApiKey(input.brand)
  const channel = workspace.channels.find((item) => item.platform === input.platform)
  const channelId = getBufferChannelId(input.brand, input.platform)

  if (!apiKey) throw new Error(`${workspace.label} Buffer API key is not configured (${workspace.apiKeyEnv}).`)
  if (!channel || !channelId) throw new Error(`${workspace.label} ${input.platform} channel ID is not configured.`)
  if (channel.expectedChannelId && channelId !== channel.expectedChannelId) {
    throw new Error(`${channel.label} does not match the verified Behavior School Buffer channel.`)
  }

  const response = await fetch('https://api.buffer.com', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `mutation CreateDraftPost($text: String!, $channelId: ChannelId!) {
        createPost(input: { text: $text, channelId: $channelId, schedulingType: automatic, mode: addToQueue, saveToDraft: true }) {
          ... on PostActionSuccess { post { id } }
          ... on MutationError { message }
        }
      }`,
      variables: { text: input.text, channelId },
    }),
  })

  if (!response.ok) throw new Error(`Buffer API returned HTTP ${response.status}.`)
  const body = await response.json() as { data?: { createPost?: { post?: { id?: string }; message?: string } }; errors?: Array<{ message?: string }> }
  if (body.errors?.length) throw new Error(body.errors.map((error) => error.message || 'Buffer API error').join(' '))

  const postId = body.data?.createPost?.post?.id
  if (!postId) throw new Error(body.data?.createPost?.message || 'Buffer returned no draft ID.')
  return { postId, channelId, workspace: workspace.label, platform: input.platform }
}
