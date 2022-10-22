export interface ProjectAnalytics {
  id: number
  name: string
  numOfValidators: string
}

export interface ProjectWebscraperEssntials {
  id: number
  name: string
  explorerUrl: string
  elementValue: string
  isSplitRequired: boolean
  separator: string
  chosenSubstring: number
}

export interface Data {
  data: ProjectAnalytics[]
}
