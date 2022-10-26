import { exec, execSync, spawn } from "child_process"
import { PrismaClient } from "@prisma/client"
import { logger } from "../logger/logger"
import { projectsWebscrapingDetails } from "../data/data"
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios"
import fs from "fs"
import {
  ProjectAnalytics,
  ProjectAnalyticsObject,
} from "interfaces/project-analytics"

const prisma = new PrismaClient()

const main = async () => {
  const GitHubClient = axios.create({
    baseURL: "https://api.github.com/",
    timeout: 1000,
    headers: {
      Accept: "application/vnd.GitHub.v3+json",
      Authorization: `Bearer ${process.env.GITHUN_TOKEN ?? ""}`,
    },
  })

  GitHubClient.interceptors.request.use(
    (request: AxiosRequestConfig) => {
      // logger.info(JSON.stringify(request, null, 2))
      logger.info(request.url)
      return request
    },
    (error: AxiosError) => {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      // logger.error(`HTTP Response Status Code: ${error.response.status}`)
      if (error.response != null) {
        // logger.error(error)
        logger.error(error.response.statusText)
        logger.error(error.message)
        // logger.error(JSON.stringify(error.response.headers, null, 2))
        logger.error("\n" + JSON.stringify(error.response.data, null, 2))
      }
    }
  )

  GitHubClient.interceptors.response.use(
    (response: AxiosResponse) => {
      // logger.info(JSON.stringify(response.data, null, 2))
      return response
    },
    (error: AxiosError) => {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      // logger.error(`HTTP Response Status Code: ${error.response.status}`)
      if (error.response != null) {
        // logger.error(error)
        logger.error(error.response.statusText)
        logger.error(error.message)
        // logger.error(JSON.stringify(error.response.headers, null, 2))
        logger.error("\n" + JSON.stringify(error.response.data, null, 2))
      }
    }
  )

  // try {
  //   exec(
  //     `cd ${process.env.PROJECT_FOLDER} && npx cypress run --browser chrome`,
  //     (error, stdout) => {
  //       if (error != null) {
  //         console.log(`error: ${error.message}`)
  //       } else {
  //         console.log(stdout)
  //         console.log("Finished running the script")
  //       }
  //     }
  //   ).stdout?.pipe(process.stdout)
  // } catch (err) {
  //   logger.error(err)
  // }

  // const child = spawn(
  //   `cd ${process.env.PROJECT_FOLDER} && npx cypress run --browser chrome`,
  //   [],
  //   {
  //     shell: true,
  //     cwd: process.cwd(),
  //     env: process.env,
  //     stdio: ["inherit", "pipe", "pipe"],
  //     windowsHide: false,
  //   }
  // )

  // child.stdout.pipe(process.stdout)

  // try {
  //   await prisma.project_Analytics.create({
  //     data: {
  //       projectId: analytics.projectId,
  //       data: analytics.data,
  //     },
  //   })
  //   console.log("Inserted new analytics successfully")
  // } catch (err) {
  //   console.log(err)
  // }

  try {
    const cmd = `cd ${process.env.PROJECT_FOLDER} && npx cypress run --browser chrome`
    execSync(cmd).toString()
  } catch (err) {
    logger.error(err)
  }

  // let projectsAnalytics = await import("../projects-analytics.json")
  // console.log(projectsAnalytics.data)
  // console.log(JSON.stringify(projectsAnalytics, null, 2))

  // for (let project of projectsWebscrapingDetails) {
  //   try {
  //     const res: AxiosResponse = await GitHubClient.get(
  //       `/repos/${project.owner}/${project.repo}/contributors`
  //     )

  //     projectsAnalytics.data.forEach((projectAnalytics: ProjectAnalytics) => {
  //       if (projectAnalytics.name === project.name) {
  //         console.log("projectAnalytics.name" + projectAnalytics.name)
  //         console.log("project.name" + project.name)
  //         projectAnalytics["numOfContributors"] = res.data.length
  //       }
  //     })
  //   } catch (err) {
  //     logger.error(err)
  //     throw err
  //   }
  // }

  const projectsAnalyticsR: string = fs.readFileSync(
    "../projects-analytics.json",
    "utf8"
  )

  logger.info(projectsAnalyticsR)

  const tempProjectAnalytics: ProjectAnalyticsObject =
    JSON.parse(projectsAnalyticsR)

  try {
    const res: AxiosResponse = await axios.get(
      "https://new-metrics.algorand.org/api/live-statistics/"
    )

    const algorandProject = tempProjectAnalytics.data.find(
      (project: ProjectAnalytics) => project.name === "Algorand"
    )
    if (algorandProject) {
      algorandProject.numOfValidators = parseInt(
        res?.data?.live_statistics
          ?.total_participation_node_count_for_last_7_days?.metric_data
      )
      tempProjectAnalytics.data = tempProjectAnalytics.data.filter(
        (project: ProjectAnalytics) => project.name !== "Algorand"
      )
      tempProjectAnalytics.data.push(algorandProject)
      tempProjectAnalytics.data.sort((projectA, projectB) =>
        projectA.id > projectB.id ? 1 : -1
      )
    }
  } catch (err) {
    logger.error(err)
  }

  fs.writeFileSync(
    "../projects-analytics.json",
    JSON.stringify(tempProjectAnalytics, null, 2)
  )
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
