import { ProjectWebscraperEssntials } from "interfaces/project-analytics"

export const projectsWebscrapingDetails: ProjectWebscraperEssntials[] = [
  {
    id: 1,
    name: "Bitcoin",
    explorerUrl: "https://bitnodes.io/nodes/",
    elementValue: ".big > :nth-child(1) > a",
    isSplitRequired: false,
    separator: "",
    chosenSubstring: 0,
  },
  {
    id: 2,
    name: "Ethereum",
    explorerUrl: "https://ethernodes.org/",
    elementValue: ":nth-child(1) > .float-right",
    isSplitRequired: true,
    separator: " ",
    chosenSubstring: 0,
  },
  {
    id: 8,
    name: "Elrond",
    explorerUrl: "https://explorer.elrond.com/validators",
    elementValue: ":nth-child(1) > .d-flex > .m-0",
    isSplitRequired: true,
    separator: "/",
    chosenSubstring: 0,
  },
  {
    id: 5,
    name: "Near",
    explorerUrl: "https://explorer.near.org/nodes/validators",
    elementValue: ".c-Validating-lkwqts",
    isSplitRequired: false,
    separator: "",
    chosenSubstring: 0,
  },
  {
    id: 19,
    name: "Arweave",
    explorerUrl: "https://v2.viewblock.io/arweave/",
    elementValue: ":nth-child(3) > .sc-2e0047d8-2 > :nth-child(2)",
    isSplitRequired: false,
    separator: "",
    chosenSubstring: 0,
  },
  {
    id: 20,
    name: "Ziliqa",
    explorerUrl: "https://v2.viewblock.io/zilliqa",
    elementValue: ":nth-child(5) > .sc-2e0047d8-2 > :nth-child(2)",
    isSplitRequired: false,
    separator: "",
    chosenSubstring: 0,
  },
  {
    id: 21,
    name: "Fantom",
    explorerUrl: "https://ftmscan.com/validators",
    elementValue: "#mytable1_wrapper > :nth-child(1)",
    isSplitRequired: true,
    separator: " ",
    chosenSubstring: 5,
  },

  {
    id: 7,
    name: "Cardano",
    explorerUrl: "https://pooltool.io/",
    elementValue:
      ":nth-child(2) > .px-3 > .d-flex > .genesis-bar > .genesis-bar__right > .genesis-bar__item > .genesis-bar__title-1",
    isSplitRequired: false,
    separator: "",
    chosenSubstring: 0,
  },

  {
    id: 9,
    name: "Avalanche",
    explorerUrl: "https://www.avax.network/validators",
    elementValue: "#tVal",
    isSplitRequired: false,
    separator: "",
    chosenSubstring: 0,
  },

  {
    id: 10,
    name: "Solana",
    explorerUrl: "https://solscan.io/validator",
    elementValue:
      ":nth-child(1) > .sc-hLeiDn > .ant-space > :nth-child(2) > .sc-ipEyDJ",
    isSplitRequired: false,
    separator: "",
    chosenSubstring: 0,
  },

  {
    id: 14,
    name: "Harmony",
    explorerUrl: "https://www.stakingrewards.com/earn/harmony/metrics/",
    elementValue:
      ".assetMetrics_validators-wrap__G0W5p > :nth-child(1) > .assetMetrics_value__wuZdv",
    isSplitRequired: false,
    separator: "",
    chosenSubstring: 0,
  },

  {
    id: 9,
    name: "Polkadot",
    explorerUrl: "https://polkadot.subscan.io/validator",
    elementValue: ":nth-child(1) > .nav-item > .metadata-item > .value",
    isSplitRequired: true,
    separator: "/",
    chosenSubstring: 0,
  },

  {
    id: 9,
    name: "BSC",
    explorerUrl: "https://bscscan.com/validators",
    elementValue: "#mytable1_wrapper > :nth-child(1)",
    isSplitRequired: true,
    separator: " ",
    chosenSubstring: 5,
  },

  {
    id: 11,
    name: "Polygon",
    explorerUrl: "https://staking.polygon.technology/",
    elementValue:
      ":nth-child(1) > .dashboard__column__info__primary__cell__info > span",
    isSplitRequired: false,
    separator: "",
    chosenSubstring: 0,
  },

  // {
  //   id: 11,
  //   name: "Hederah Hashgraph",
  //   explorer_address: "https://hashscan.io/mainnet/nodes",
  //   element_value:
  //     ":nth-child(1) > .dashboard__column__info__primary__cell__info > span",
  //   requires_split: false,
  //   split_by: "",
  //   part_of_substring: 0,
  // },

  {
    id: 11,
    name: "Kusama",
    explorerUrl: "https://kusama.subscan.io/validator",
    elementValue: ":nth-child(1) > .nav-item > .metadata-item > .value",
    isSplitRequired: true,
    separator: "/",
    chosenSubstring: 0,
  },

  {
    id: 13,
    name: "Cosmos",
    explorerUrl: "https://www.mintscan.io/cosmos/validators",
    elementValue:
      ":nth-child(2) > :nth-child(1) > .DataCard_dataCardWrapper__ZINBT > .DataCard_value__17jag",
    isSplitRequired: true,
    separator: " ",
    chosenSubstring: 0,
  },
]
