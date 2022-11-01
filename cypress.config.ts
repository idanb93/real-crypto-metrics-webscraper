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
        editData: (projectInfos: ProjectAnalytics) => {
          data.data = data.data.filter(
            (project) => project.name !== projectInfos.name
          )
          data.data.push(projectInfos)
          return null
        },
        getData: (): ProjectAnalyticsObject => {
          return data
        },

        getProject: (projectId: number): ProjectAnalytics => {
          return (
            data.data.find(
              (currentProject) => projectId === currentProject.id
            ) ?? { id: -1, name: "" }
          )
        },

        sortData: () => {
          data.data.sort((proj1, proj2) => proj1.id - proj2.id)
          return null
        },
        cleanUpData: () => {
          data.data = []
          return null
        },
      })
    },
  },
  viewportHeight: 1080,
  viewportWidth: 720,
  video: false,
  chromeWebSecurity: false,
  env: {
    PROJECTS: projectsWebscrapingDetails,
  },
})
