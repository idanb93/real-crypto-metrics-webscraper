import { ProjectAnalyticsObject } from "interfaces/project-analytics"
import { logger } from "../logger/logger"
import { PrismaClient } from "@prisma/client"
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios"
import fs from "fs"
import {
  defilama,
  getLinkSupportedChains,
  okLinkSupportedChains,
} from "../data/data"

const prisma = new PrismaClient()

const main = async () => {
  const projectsAnalytics: string = fs.readFileSync(
    `${process.env.PROJECT_FOLDER}/projects-analytics.json`,
    "utf8"
  )

  const tempProjectAnalytics: ProjectAnalyticsObject =
    JSON.parse(projectsAnalytics)

  const okLinkAPI = async (chainShortName: string, chainFullName: string) => {
    const res: AxiosResponse = await axios.get(
      `https://www.oklink.com/api/v5/explorer/blockchain/address?chainShortName=${chainShortName}`,
      {
        headers: {
          "Ok-Access-Key": `${process.env.OKLINK_API_KEY}` ?? "",
        },
      }
    )

    for (const project of tempProjectAnalytics.data) {
      if (project.name === chainFullName) {
        project.totalAddresses = parseInt(res.data?.data[0]?.validAddressCount)
        project.dailyNewAddresses = parseInt(
          res.data?.data[0]?.newActiveAddresses
        )
        project.dailyActiveAddresses = parseInt(
          res.data?.data[0]?.activeAddresses
        )
      }
    }

    const res2: AxiosResponse = await axios.get(
      `https://www.oklink.com/api/v5/explorer/blockchain/transaction?chainShortName=${chainShortName}`,
      {
        headers: {
          "Ok-Access-Key": `${process.env.OKLINK_API_KEY}` ?? "",
        },
      }
    )

    for (const project of tempProjectAnalytics.data) {
      if (project.name === chainFullName) {
        project.totalTransactions = parseInt(
          res2.data?.data[0]?.totalTransactionCount
        )
        project.transactionsPerSecond = +res2.data?.data[0]?.tranRate
        project.dailyTransactions = parseInt(
          res2.data?.data[0]?.avgTransactionCount24h
        )
      }
    }
  }

  const getBlockAPI = async (chainShortName: string, chainFullName: string) => {
    const res: AxiosResponse = await axios.get(
      `https://explorer-api.getblock.io/${chainShortName}/summary/chain`
    )

    for (const project of tempProjectAnalytics.data) {
      if (project.name === chainFullName) {
        project.totalTransactions = res.data?.transactions
        project.totalAddresses = res.data?.accounts
        project.transactionsPerSecond = +(res.data?.tx_per_second * 1).toFixed(
          2
        )
        project.validators =
          res.data?.nodes_validating || res.data?.node_validating
      }
    }
  }

  try {
    logger.info("Querying Algorand API")
    const AlgorandAPIResponse: AxiosResponse = await axios.get(
      "https://new-metrics.algorand.org/api/live-statistics/"
    )

    for (const project of tempProjectAnalytics.data) {
      if (project.name === "Algorand") {
        project.validators = parseInt(
          AlgorandAPIResponse.data?.live_statistics
            ?.total_participation_node_count_for_last_7_days?.metric_data
        )
        project.totalAddresses = parseInt(
          AlgorandAPIResponse.data?.live_statistics?.total_created_address_count
            ?.metric_data
        )
        project.dailyActiveAddresses = parseInt(
          AlgorandAPIResponse.data?.live_statistics
            ?.total_active_address_count_for_last_30_days?.metric_data
        )
        project.transactionsPerSecond = +(
          AlgorandAPIResponse.data?.live_statistics
            ?.avg_transaction_count_per_second_for_last_7_days?.metric_data * 1
        ).toFixed(2)
        project.dailyTransactions = parseInt(
          AlgorandAPIResponse.data?.live_statistics
            ?.total_transaction_count_for_last_7_days?.metric_data
        )
      }
    }

    logger.info("Querying Avalanche API")
    const AvalancheAPIResponse: AxiosResponse = await axios.get(
      "https://avascan.info/api/v1/home/statistics"
    )

    for (const project of tempProjectAnalytics.data) {
      if (project.name === "Avalanche") {
        project.validators = AvalancheAPIResponse?.data?.validators
        project.dailyTransactions =
          AvalancheAPIResponse?.data?.lastTransactions24h
        project.transactionsPerSecond =
          +(AvalancheAPIResponse?.data?.lastAvgTps24h).toFixed(2)
      }
    }

    logger.info("Querying Solana API")
    const SolanaAPIResponse: AxiosResponse = await axios.get(
      "https://api.solscan.io/chaininfo?cluster="
    )

    for (const project of tempProjectAnalytics.data) {
      if (project.name === "Solana") {
        project.validators =
          SolanaAPIResponse.data?.data?.networkInfo?.totalValidators
        project.totalTransactions =
          SolanaAPIResponse.data?.data?.networkInfo?.transactionCount
        project.transactionsPerSecond = +(
          SolanaAPIResponse.data?.data?.networkInfo?.tps * 1
        ).toFixed(2)
      }
    }

    logger.info("Querying Elrond API")
    const ElrondAPIResponse: AxiosResponse = await axios.get(
      "https://api.elrondmonitor.com/stats/validators"
    )

    for (const project of tempProjectAnalytics.data) {
      if (project.name === "Elrond") {
        project.validators = ElrondAPIResponse.data?.validators
        project.observerNodes = ElrondAPIResponse.data?.observer_nodes
      }
    }

    logger.info("Querying Elrond API 2")
    const ElrondAPIResponse2: AxiosResponse = await axios.get(
      "https://api.elrondmonitor.com/stats"
    )

    for (const project of tempProjectAnalytics.data) {
      if (project.name === "Elrond") {
        project.totalTransactions = ElrondAPIResponse2.data?.total_txs
        project.totalAddresses = ElrondAPIResponse2.data?.total_accounts
      }
    }

    logger.info("Querying Cosmos API")
    const CosmosAPIResponse: AxiosResponse = await axios.get(
      "https://api.cosmostation.io/v1/status"
    )

    for (const project of tempProjectAnalytics.data) {
      if (project.name === "Cosmos") {
        project.validators = CosmosAPIResponse.data?.unjailed_validator_num
        project.totalTransactions = CosmosAPIResponse.data?.total_txs_num
        // project.totalAddresses = CosmosAPIResponse.data?.total_accounts
      }
    }

    logger.info("Querying OkLink API")
    for (const chain of okLinkSupportedChains) {
      await okLinkAPI(chain.chainShortName, chain.chainFullName)
    }

    logger.info("Querying getBlock API")
    for (const chain of getLinkSupportedChains) {
      await getBlockAPI(chain.chainShortName, chain.chainFullName)
    }

    logger.info("Querying defiLama API")
    const defiLamaResponse: AxiosResponse = await axios.get(
      "https://api.llama.fi/chains"
    )

    for (const defiLamaProject of defilama) {
      for (const tempProject of tempProjectAnalytics.data) {
        if (tempProject.name === defiLamaProject.projectName) {
          tempProject.totalValueLocked = +defiLamaResponse.data
            ?.find(
              (project: any) => project.gecko_id === defiLamaProject.coinGecko
            )
            .tvl.toFixed(2)
        }
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
    `${process.env.PROJECT_FOLDER}/projects-analytics.json`,
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
