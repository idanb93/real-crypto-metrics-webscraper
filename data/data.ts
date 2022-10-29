import { ProjectWebscraperEssntials } from "interfaces/project-analytics"

export const projectsWebscrapingDetails: ProjectWebscraperEssntials[] = [
  {
    id: 1,
    name: "Bitcoin",
    explorerUrl: "https://bitnodes.io/nodes/",
    elementValue: ".big > :nth-child(1) > a",
    owner: "bitcoin",
    repo: "bitcoin",
    pageLoadingTime: 3000,
  },
  {
    id: 2,
    name: "Ethereum",
    explorerUrl: "https://ethernodes.org/",
    elementValue: ":nth-child(1) > .float-right",
    isSplitRequired: true,
    separator: " ",
    chosenSubstring: 0,
    owner: "ethereum",
    repo: "go-ethereum",
    hasUsedBySection: true,
  },
  {
    id: 3,
    name: "Elrond",
    explorerUrl: "https://explorer.elrond.com/validators",
    elementValue: ":nth-child(1) > .d-flex > .m-0",
    isSplitRequired: true,
    separator: "/",
    chosenSubstring: 0,
    owner: "ElrondNetwork",
    repo: "elrond-go",
  },
  {
    id: 4,
    name: "Near",
    owner: "near",
    repo: "nearcore",
  },
  {
    id: 5,
    name: "Fantom",
    explorerUrl: "https://ftmscan.com/validators",
    elementValue: "#mytable1_wrapper > :nth-child(1)",
    isSplitRequired: true,
    separator: " ",
    chosenSubstring: 5,
    owner: "Fantom-Foundation",
    repo: "go-opera",
  },
  {
    id: 6,
    name: "Avalanche",
    owner: "ava-labs",
    repo: "avalanchego",
    hasUsedBySection: true,
  },
  {
    id: 7,
    name: "Harmony",
    explorerUrl: "https://www.stakingrewards.com/earn/harmony/metrics/",
    elementValue:
      ".assetMetrics_validators-wrap__G0W5p > :nth-child(1) > .assetMetrics_value__wuZdv",
    owner: "harmony-one",
    repo: "harmony",
  },
  {
    id: 8,
    name: "BSC",
    explorerUrl: "https://bscscan.com/validators",
    elementValue: "#mytable1_wrapper > :nth-child(1)",
    isSplitRequired: true,
    separator: " ",
    chosenSubstring: 5,
    owner: "bnb-chain",
    repo: "bsc",
  },
  {
    id: 9,
    name: "Solana",
    owner: "solana-labs",
    repo: "solana",
  },
  {
    id: 10,
    name: "Cosmos",
    explorerUrl: "https://www.mintscan.io/cosmos/validators",
    elementValue:
      ":nth-child(2) > :nth-child(1) > .DataCard_dataCardWrapper__ZINBT > .DataCard_value__17jag",
    isSplitRequired: true,
    separator: " ",
    chosenSubstring: 0,
    owner: "cosmos",
    repo: "cosmos-sdk",
  },
  {
    id: 11,
    name: "Zilliqa",
    explorerUrl: "https://v2.viewblock.io/zilliqa",
    elementValue: ":nth-child(5) > .sc-2e0047d8-2 > :nth-child(2)",
    owner: "Zilliqa",
    repo: "Zilliqa",
  },
  {
    id: 12,
    name: "Algorand",
    owner: "algorand",
    repo: "go-algorand",
    hasUsedBySection: true,
  },
  {
    id: 13,
    name: "Polygon",
    explorerUrl: "https://staking.polygon.technology/",
    elementValue:
      ":nth-child(1) > .dashboard__column__info__primary__cell__info > span",
    owner: "maticnetwork",
    repo: "bor",
  },
  {
    id: 14,
    name: "Polkadot",
    explorerUrl: "https://polkadot.subscan.io/validator",
    elementValue: ":nth-child(1) > .nav-item > .metadata-item > .value",
    isSplitRequired: true,
    separator: "/",
    chosenSubstring: 0,
    owner: "paritytech",
    repo: "polkadot",
  },
  {
    id: 15,
    name: "Cardano",
    explorerUrl: "https://pooltool.io/",
    elementValue:
      ":nth-child(2) > .px-3 > .d-flex > .genesis-bar > .genesis-bar__right > .genesis-bar__item > .genesis-bar__title-1",
    owner: "cardano-foundation",
    repo: "CIPs",
  },
  {
    id: 16,
    name: "Arweave",
    explorerUrl: "https://v2.viewblock.io/arweave/",
    elementValue: ":nth-child(3) > .sc-2e0047d8-2 > :nth-child(2)",
    owner: "ArweaveTeam",
    repo: "arweave",
  },

  // {
  //   id: 11,
  //   name: "Hederah Hashgraph",
  //   explorerUrl: "https://hashscan.io/mainnet/nodes",
  //   elementValue:
  //     ":nth-child(1) > .dashboard__column__info__primary__cell__info > span",
  //   owner: "hashgraph",
  //   repo: "hedera-services",
  // },

  {
    id: 17,
    name: "Kusama",
    explorerUrl: "https://kusama.subscan.io/validator",
    elementValue: ":nth-child(1) > .nav-item > .metadata-item > .value",
    isSplitRequired: true,
    separator: "/",
    chosenSubstring: 0,
  },
  {
    id: 18,
    name: "Syscoin",
    explorerUrl: "https://chainz.cryptoid.info/sys/masternodes.dws",
    elementValue: "#map-title",
    isSplitRequired: true,
    separator: " ",
    chosenSubstring: 0,
    hasUsedBySection: true,
    owner: "syscoin",
    repo: "pali-wallet",
  },
  {
    id: 19,
    name: "Fusion",
    explorerUrl: "https://fsnscan.com/",
    elementValue:
      ":nth-child(2) > :nth-child(2) > .InfoItem_container__BLIaH > .InfoItem_c__bnPu8",
    owner: "FUSIONFoundation",
    repo: "efsn",
    pageLoadingTime: 4000,
  },
]

export const xPathProjects = {
  Arweave: "/html/body/div/div[5]/div[2]/div/div[1]/div[5]/div[2]/span[2]",
  Zilliqa: "/html/body/div/div[5]/div[2]/div/div[1]/div[5]/div[2]/span[2]",
  // Avalanche: "/html/body/div[2]/div/div[2]/div[2]/div[2]/div/div[2]",
}

export const projectsUsingNodes = [
  "Bitcoin",
  "Ethereum",
  "Elrond",
  "Zilliqa",
  "Cardano",
  "Syscoin",
  "Arweave",
]

export const chains = [
  {
    chainShortName: "BTC",
    chainFullName: "Bitcoin",
  },
  {
    chainShortName: "ETH",
    chainFullName: "Ethereum",
  },
  {
    chainShortName: "FTM",
    chainFullName: "Fantom",
  },
  {
    chainShortName: "BSC",
    chainFullName: "BSC",
  },
]
