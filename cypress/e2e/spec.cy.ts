import { xPathProjects } from "data/data"

describe("Blockchains Explorers Webscraper", () => {
  // for (let project of Cypress.env("PROJECTS")) {
  //   if (project.explorerUrl) {
  //     it(`${project.name} Explorer`, () => {
  //       cy.visit(project.explorerUrl)
  //       cy.wait(project.pageLoadingTime)
  //       Object.keys(xPathProjects).includes(project.name)
  //         ? cy.xpath(xPathProjects[project.name]).invoke("text").as("nodes")
  //         : cy.get(project.elementValue).invoke("text").as("nodes")

  //       cy.get("@nodes").then((nodes) => {
  //         cy.log(`${nodes}`)
  //         const nodesArray: String[] = project.isSplitRequired
  //           ? new String(nodes).split(project.separator)
  //           : []
  //         cy.task("pushData", {
  //           id: project.id,
  //           name: project.name,
  //           numOfValidators: project.isSplitRequired
  //             ? parseInt(
  //                 `${nodesArray[project.chosenSubstring]}`
  //                   .replaceAll(",", "")
  //                   .replaceAll(" ", "")
  //               )
  //             : parseInt(`${nodes}`.replaceAll(",", "").replaceAll(" ", "")),
  //         })
  //       })
  //     })
  //   }
  // }

  //   if (project.owner) {
  //     it(`${project.owner} Github Account`, () => {
  //       cy.visit(`https://github.com/${project.owner}/${project.repo}`)
  //       let nthChild: string = "5"
  //       if (project.hasUsedBySection) {
  //         nthChild = "4"
  //       }
  //       cy.get(
  //         `:nth-child(${nthChild}) > .BorderGrid-cell > .h4 > .Link--primary > .Counter`
  //       )
  //         .invoke("text")
  //         .as("contributors")
  //       cy.get("@contributors").then((contributors) => {
  //         const contributorsAsAString = `${contributors}`
  //         if (project.explorerUrl) {
  //           cy.task("editData", {
  //             projectName: project.name,
  //             contributors: parseInt(contributorsAsAString),
  //           })
  //         } else {
  //           cy.task("pushData", {
  //             id: project.id,
  //             name: project.name,
  //             contributors: parseInt(contributorsAsAString),
  //           })
  //         }
  //       })
  //     })
  //   }
  // }

  // it("test", () => {
  //   cy.visit(`https://github.com/syscoin/pali-wallet`)
  //   let nthChild: string = "5"
  //   // if (project.hasUsedBySection) {
  //   //   nthChild = "4"
  //   // }
  //   cy.get(
  //     `:nth-child(${nthChild}) > .BorderGrid-cell > .h4 > .Link--primary > .Counter`
  //   )
  //     .invoke("text")
  //     .as("contributors")
  //   cy.get("@contributors").then((contributors) => {
  //     const contributorsAsAString = `${contributors}`
  //     cy.log(contributorsAsAString)
  //     cy.task("editData", {
  //       projectName: "Bitcoin",
  //       contributors: parseInt(contributorsAsAString),
  //     })
  //   })
  // })

  // it.only("Test used for development", () => {
  //   cy.visit("https://www.avax.network/validators")
  //   cy.wait(7000)
  //   cy.xpath("/html/body/div[2]/div/div[2]/div[2]/div[2]/div/div[2]")
  //     // cy.get(
  //     //   ".metrics_overview-page__first-row > :nth-child(3) > .overview-card__numeric-value > .overview-card__numeric-value-container > .is-vertically-centered > .animated-counter-container"
  //     // )
  //     .invoke("text")
  //     .as("nodes")
  //   cy.get("@nodes").then((nodes) => {
  //     cy.log(`${nodes}`)
  //     const nodesArray = new String(nodes).split("/")
  //     cy.task("pushData", {
  //       project_id: 21,
  //       name: "Kusama",
  //       numOfValidators: `${nodesArray[0]}`,
  //     })
  //   })
  // })

  after(() => {
    cy.task("getData").then((data) => {
      cy.log(data)
      cy.writeFile("projects-analytics.json", data)
    })

    cy.task("cleanUpData")
  })
})
