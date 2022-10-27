import { ProjectAnalyticsObject } from "interfaces/project-analytics"
import { logger } from "../logger/logger"
import { execSync } from "child_process"
import { PrismaClient } from "@prisma/client"
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios"
import fs from "fs"

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

  try {
    const cmd = `cd ${process.env.PROJECT_FOLDER} && npx cypress run --browser chrome`
    execSync(cmd, {
      encoding: "utf-8",
      stdio: "inherit",
    })
  } catch (err) {
    logger.error(err)
  }

  const projectsAnalytics: string = fs.readFileSync(
    "../projects-analytics.json",
    "utf8"
  )

  const tempProjectAnalytics: ProjectAnalyticsObject =
    JSON.parse(projectsAnalytics)

  try {
    const algorandAPIResponse: AxiosResponse = await axios.get(
      "https://new-metrics.algorand.org/api/live-statistics/"
    )

    for (const project of tempProjectAnalytics.data) {
      if (project.name === "Algorand") {
        project.numOfValidators = parseInt(
          algorandAPIResponse?.data?.live_statistics
            ?.total_participation_node_count_for_last_7_days?.metric_data
        )
        project.totalAddresses = parseInt(
          algorandAPIResponse?.data?.live_statistics
            ?.total_created_address_count?.metric_data
        )
        project.dailyActiveAddresses = parseInt(
          algorandAPIResponse?.data?.live_statistics
            ?.total_active_address_count_for_last_30_days?.metric_data
        )
        project.transactionsPerSecond = parseInt(
          algorandAPIResponse?.data?.live_statistics
            ?.avg_transaction_count_per_second_for_last_7_days?.metric_data
        )
        project.dailyTransactions = parseInt(
          algorandAPIResponse?.data?.live_statistics
            ?.total_transaction_count_for_last_7_days?.metric_data
        )
      }
    }

    const AvalancheAPIResponse: AxiosResponse = await axios.get(
      "https://avascan.info/api/v1/home/statistics"
    )

    for (const project of tempProjectAnalytics.data) {
      if (project.name === "Avalanche") {
        project.numOfValidators = AvalancheAPIResponse?.data?.validators
        project.dailyTransactions =
          AvalancheAPIResponse?.data?.lastTransactions24h
        project.transactionsPerSecond = parseInt(
          AvalancheAPIResponse?.data?.lastAvgTps24h
        )
      }
    }

    const SolanaAPIResponse: AxiosResponse = await axios.get(
      "https://api.solscan.io/chaininfo?cluster="
    )

    for (const project of tempProjectAnalytics.data) {
      if (project.name === "Solana") {
        project.numOfValidators =
          SolanaAPIResponse.data?.data?.networkInfo?.totalValidators
        project.totalTransactions =
          SolanaAPIResponse.data?.data?.networkInfo?.transactionCount
        project.transactionsPerSecond =
          SolanaAPIResponse.data?.data?.networkInfo?.tps
      }
    }
  } catch (err) {
    logger.error(err)
  }

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

  fs.writeFileSync(
    "../projects-analytics.json",
    JSON.stringify(tempProjectAnalytics, null, 2)
  )

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
