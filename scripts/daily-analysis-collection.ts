import { ProjectAnalyticsObject } from "interfaces/project-analytics"
import { logger } from "../logger/logger"
import { execSync } from "child_process"
import { PrismaClient } from "@prisma/client"
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios"
import fs from "fs"
import { chains } from "../data/data"

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
  //   const cmd = `cd ${process.env.PROJECT_FOLDER} && npx cypress run --browser chrome`
  //   execSync(cmd, {
  //     encoding: "utf-8",
  //     stdio: "inherit",
  //   })
  // } catch (err) {
  //   logger.error(err)
  // }

  const projectsAnalytics: string = fs.readFileSync(
    "../projects-analytics.json",
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
        console.log(res.data)

        project.totalAddresses = parseInt(res.data?.data[0]?.validAddressCount)
        project.dailyNewAddresses = parseInt(
          res.data?.data[0]?.newAddressCount24h
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
        project.transactionsPerSecond = parseInt(res2.data?.data[0]?.tranRate)
        project.dailyTransactions = parseInt(
          res2.data?.data[0]?.avgTransactionCount24h
        )
      }
    }
  }

  try {
    const AlgorandAPIResponse: AxiosResponse = await axios.get(
      "https://new-metrics.algorand.org/api/live-statistics/"
    )

    for (const project of tempProjectAnalytics.data) {
      if (project.name === "Algorand") {
        project.validators = parseInt(
          AlgorandAPIResponse?.data?.live_statistics
            ?.total_participation_node_count_for_last_7_days?.metric_data
        )
        project.totalAddresses = parseInt(
          AlgorandAPIResponse?.data?.live_statistics
            ?.total_created_address_count?.metric_data
        )
        project.dailyActiveAddresses = parseInt(
          AlgorandAPIResponse?.data?.live_statistics
            ?.total_active_address_count_for_last_30_days?.metric_data
        )
        project.transactionsPerSecond = parseInt(
          AlgorandAPIResponse?.data?.live_statistics
            ?.avg_transaction_count_per_second_for_last_7_days?.metric_data
        )
        project.dailyTransactions = parseInt(
          AlgorandAPIResponse?.data?.live_statistics
            ?.total_transaction_count_for_last_7_days?.metric_data
        )
      }
    }

    const AvalancheAPIResponse: AxiosResponse = await axios.get(
      "https://avascan.info/api/v1/home/statistics"
    )

    for (const project of tempProjectAnalytics.data) {
      if (project.name === "Avalanche") {
        project.validators = AvalancheAPIResponse?.data?.validators
        project.dailyTransactions =
          AvalancheAPIResponse?.data?.lastTransactions24h
        project.transactionsPerSecond = parseInt(
          AvalancheAPIResponse?.data?.lastAvgTps24h
        )
      }
    }

    const SolanaAPIResponse: AxiosResponse = await axios.get(
      "https://api.solscan.io/market?symbol=SOL&cluster="
    )

    const SolanaAPIResponse2: AxiosResponse = await axios.get(
      "https://api.solscan.io/chaininfo?cluster="
    )

    for (const project of tempProjectAnalytics.data) {
      if (project.name === "Solana") {
        project.validators =
          SolanaAPIResponse2.data?.data?.networkInfo?.totalValidators
        project.totalTransactions =
          SolanaAPIResponse2.data?.data?.networkInfo?.transactionCount
        project.transactionsPerSecond =
          SolanaAPIResponse2.data?.data?.networkInfo?.tps
        project.totalValueLocked =
          SolanaAPIResponse2?.data?.data?.solStakeOverview?.total *
          SolanaAPIResponse?.data?.data?.priceUsdt
      }
    }

    const ElrondAPIResponse: AxiosResponse = await axios.get(
      "https://api.elrondmonitor.com/stats/validators"
    )

    for (const project of tempProjectAnalytics.data) {
      if (project.name === "Elrond") {
        project.validators = ElrondAPIResponse.data?.validators
        project.observerNodes = ElrondAPIResponse.data?.observer_nodes
      }
    }

    const ElrondAPIResponse2: AxiosResponse = await axios.get(
      "https://api.elrondmonitor.com/stats"
    )

    for (const project of tempProjectAnalytics.data) {
      if (project.name === "Elrond") {
        project.totalTransactions = ElrondAPIResponse2.data?.total_txs
        project.totalAddresses = ElrondAPIResponse2.data?.total_accounts
        project.totalValueLocked = +(
          ElrondAPIResponse2?.data?.price *
          1 *
          ElrondAPIResponse?.data?.active_stake *
          1
        ).toFixed(2)
      }
    }

    const NearAPIResponse: AxiosResponse = await axios.get(
      "https://explorer-api.getblock.io/near/summary/chain"
    )

    for (const project of tempProjectAnalytics.data) {
      if (project.name === "Near") {
        project.totalTransactions = NearAPIResponse.data?.transactions
        project.totalAddresses = NearAPIResponse.data?.accounts
        project.validators = NearAPIResponse.data?.node_validating
        project.transactionsPerSecond = NearAPIResponse.data?.tx_per_second
      }
    }

    // const okLinkResponses = chains.map((chain) => {
    //   return okLinkAPI(chain.chainShortName, chain.chainFullName)
    // })

    // Promise.all(okLinkResponses)

    // for (const chain of chains) {
    //   okLinkAPI(chain.chainShortName, chain.chainFullName)
    // }

    // const BitcoinResponse: AxiosResponse = await axios.get(
    //   "https://www.oklink.com/api/v5/explorer/blockchain/address?chainShortName=BTC",
    //   {
    //     headers: {
    //       "Ok-Access-Key": `${process.env.OKLINK_API_KEY}` ?? "",
    //     },
    //   }
    // )

    // for (const project of tempProjectAnalytics.data) {
    //   if (project.name === "Bitcoin") {
    //     project.totalAddresses = parseInt(
    //       BitcoinResponse.data?.data[0]?.validAddressCount
    //     )
    //     project.dailyNewAddresses = parseInt(
    //       BitcoinResponse.data?.data[0]?.newAddressCount24h
    //     )
    //     project.dailyActiveAddresses = parseInt(
    //       BitcoinResponse.data?.data[0]?.activeAddresses
    //     )
    //   }
    // }

    // const BitcoinResponse2: AxiosResponse = await axios.get(
    //   "https://www.oklink.com/api/v5/explorer/blockchain/transaction?chainShortName=BTC",
    //   {
    //     headers: {
    //       "Ok-Access-Key": `${process.env.OKLINK_API_KEY}` ?? "",
    //     },
    //   }
    // )

    // for (const project of tempProjectAnalytics.data) {
    //   if (project.name === "Bitcoin") {
    //     project.totalTransactions = parseInt(
    //       BitcoinResponse2.data?.data[0]?.totalTransactionCount
    //     )
    //     project.transactionsPerSecond = parseInt(
    //       BitcoinResponse2.data?.data[0]?.tranRate
    //     )
    //     project.dailyTransactions = parseInt(
    //       BitcoinResponse2.data?.data[0]?.avgTransactionCount24h
    //     )
    //   }
    // }

    // const EthereumResponse: AxiosResponse = await axios.get(
    //   "https://www.oklink.com/api/v5/explorer/blockchain/address?chainShortName=ETH",
    //   {
    //     headers: {
    //       "Ok-Access-Key": `${process.env.OKLINK_API_KEY}` ?? "",
    //     },
    //   }
    // )

    // for (const project of tempProjectAnalytics.data) {
    //   if (project.name === "Ethereum") {
    //     project.totalAddresses = parseInt(
    //       EthereumResponse.data?.data[0]?.validAddressCount
    //     )
    //     project.dailyNewAddresses = parseInt(
    //       EthereumResponse.data?.data[0]?.newAddressCount24h
    //     )
    //     project.dailyActiveAddresses = parseInt(
    //       EthereumResponse.data?.data[0]?.activeAddresses
    //     )
    //   }
    // }

    // const EthereumResponse2: AxiosResponse = await axios.get(
    //   "https://www.oklink.com/api/v5/explorer/blockchain/transaction?chainShortName=ETH",
    //   {
    //     headers: {
    //       "Ok-Access-Key": `${process.env.OKLINK_API_KEY}` ?? "",
    //     },
    //   }
    // )

    // for (const project of tempProjectAnalytics.data) {
    //   if (project.name === "Ethereum") {
    //     project.totalTransactions = parseInt(
    //       EthereumResponse2.data?.data[0]?.totalTransactionCount
    //     )
    //     project.transactionsPerSecond = parseInt(
    //       EthereumResponse2.data?.data[0]?.tranRate
    //     )
    //     project.dailyTransactions = parseInt(
    //       EthereumResponse2.data?.data[0]?.avgTransactionCount24h
    //     )
    //   }
    // }

    // const FantomResponse: AxiosResponse = await axios.get(
    //   "https://www.oklink.com/api/v5/explorer/blockchain/address?chainShortName=FTM",
    //   {
    //     headers: {
    //       "Ok-Access-Key": `${process.env.OKLINK_API_KEY}` ?? "",
    //     },
    //   }
    // )

    // for (const project of tempProjectAnalytics.data) {
    //   if (project.name === "Fantom") {
    //     project.totalAddresses = parseInt(
    //       FantomResponse.data?.data[0]?.validAddressCount
    //     )
    //     project.dailyNewAddresses = parseInt(
    //       FantomResponse.data?.data[0]?.newAddressCount24h
    //     )
    //     project.dailyActiveAddresses = parseInt(
    //       FantomResponse.data?.data[0]?.activeAddresses
    //     )
    //   }
    // }

    // const FantomResponse2: AxiosResponse = await axios.get(
    //   "https://www.oklink.com/api/v5/explorer/blockchain/transaction?chainShortName=FTM",
    //   {
    //     headers: {
    //       "Ok-Access-Key": `${process.env.OKLINK_API_KEY}` ?? "",
    //     },
    //   }
    // )

    // for (const project of tempProjectAnalytics.data) {
    //   if (project.name === "Fantom") {
    //     project.totalTransactions = parseInt(
    //       FantomResponse2.data?.data[0]?.totalTransactionCount
    //     )
    //     project.transactionsPerSecond = parseInt(
    //       FantomResponse2.data?.data[0]?.tranRate
    //     )
    //     project.dailyTransactions = parseInt(
    //       FantomResponse2.data?.data[0]?.avgTransactionCount24h
    //     )
    //   }
    // }
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
