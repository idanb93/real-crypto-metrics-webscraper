export interface ProjectAnalytics {
  id: number
  name: string
  validators?: number
  nodes?: number
  observerNodes?: number
  contributors?: number
  totalAddresses?: number
  dailyActiveAddresses?: number
  dailyNewAddresses?: number
  totalTransactions?: number
  dailyTransactions?: number
  transactionsPerSecond?: number
  totalValueLocked?: number
}

export interface ProjectAnalyticsObject {
  data: ProjectAnalytics[]
}

export interface ProjectWebscraperEssntials {
  id: number
  name: string
  explorerUrl?: string
  elementValue?: string
  isSplitRequired?: boolean
  separator?: string
  chosenSubstring?: number
  owner?: string
  repo?: string
  hasUsedBySection?: boolean
  pageLoadingTime?: number
}

export interface GithubContributors {
  login: string
  id: number
  node_id: string
  avatar_url: string
  gravatar_id: string
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  site_admin: boolean
  contributions: number
}

export interface AvalancheAPI {
  provider: string
  validators: number
}

export interface CosmosAPI2 {
  validator: string
  value: number
}
