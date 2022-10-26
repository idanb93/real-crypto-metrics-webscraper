import {
  ProjectAnalyticsObject,
  ProjectAnalytics,
} from "interfaces/project-analytics"
import { projectsWebscrapingDetails } from "data/data"
import { defineConfig } from "cypress"

const data: ProjectAnalyticsObject = {
  data: [],
}

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on("task", {
        pushData: (projectInfos: ProjectAnalytics) => {
          data.data.push(projectInfos)
          return null
        },
        editData: ({ projectName, contributors }) => {
          data.data.forEach((project) => {
            if (project.name === projectName) {
              project.numOfContributors = contributors
            }
          })
          return null
        },
        getData: (): ProjectAnalyticsObject => {
          return data
        },
        cleanUpData: () => {
          data.data = []
          return null
        },
      })
    },
  },
  video: false,
  chromeWebSecurity: false,
  env: {
    PROJECTS: projectsWebscrapingDetails,
  },
})
