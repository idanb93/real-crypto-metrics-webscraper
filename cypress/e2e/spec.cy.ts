import { projectsUsingNodes, xPathProjects } from "data/data"
import { ProjectAnalytics } from "interfaces/project-analytics"

describe("Blockchains Explorers Webscraper", () => {
  for (let project of Cypress.env("PROJECTS")) {
    if (project.explorerUrl) {
      it(`${project.name} Explorer`, () => {
        const networkArchitecture = projectsUsingNodes.includes(project.name)
          ? "nodes"
          : "validators"
        cy.visit(project.explorerUrl)
        cy.wait(project.pageLoadingTime | 3000)
        Object.keys(xPathProjects).includes(project.name)
          ? cy
              .xpath(xPathProjects[project.name])
              .invoke("text")
              .as("nodesOrValidators")
          : cy.get(project.elementValue).invoke("text").as("nodesOrValidators")

        cy.get("@nodesOrValidators").then((nodesOrValidators) => {
          cy.log(`${nodesOrValidators}`)
          const nodesOrValidatorsArray: string[] = project.isSplitRequired
            ? `${nodesOrValidators}`.split(project.separator)
            : []
          cy.task("pushData", {
            id: project.id,
            name: project.name,
            [`${networkArchitecture}`]: project.isSplitRequired
              ? parseInt(
                  `${nodesOrValidatorsArray[project.chosenSubstring]}`
                    .replaceAll(",", "")
                    .replaceAll(" ", "")
                )
              : parseInt(
                  `${nodesOrValidators}`.replaceAll(",", "").replaceAll(" ", "")
                ),
          })
          cy.task("getData").then((data) => {
            cy.log(JSON.stringify(data, null, 2))
          })
        })
      })
    }

    if (project.owner) {
      it(`${project.owner} Github Account`, () => {
        const nthChild: string = project.hasUsedBySection ? "4" : "5"
        cy.visit(`https://github.com/${project.owner}/${project.repo}`)
        cy.wait(2000)
        cy.get(
          `:nth-child(${nthChild}) > .BorderGrid-cell > .h4 > .Link--primary > .Counter`
        )
          .invoke("text")
          .as("contributors")
        cy.get("@contributors").then((contributors) => {
          const contributorsAsAString: string = `${contributors}`

          // Checks if there is data of the current project in the global data array:
          cy.task("getData").then((data: any) => {
            cy.log(data.data)
            const selectedProject = data.data.find(
              (currentTestProject: ProjectAnalytics) =>
                project.name === currentTestProject.name
            )
            selectedProject
              ? cy
                  .task("getProject", project.id)
                  .then((currentProject: any) => {
                    cy.task("editData", {
                      id: currentProject?.id ?? project.id,
                      name: currentProject?.name ?? project.name,
                      validators: currentProject?.validators ?? 0,
                      nodes: currentProject?.nodes ?? 0,
                      contributors: parseInt(contributorsAsAString),
                    })
                  })
              : // If there is no data about the current project push it.
                cy.task("pushData", {
                  id: project.id,
                  name: project.name,
                  contributors: parseInt(contributorsAsAString),
                })
          })

          // project.explorerUrl
          //   ? cy.task("getProject", project.id).then((currentProject: any) => {
          //       cy.task("editData", {
          //         id: currentProject?.id ?? project.id,
          //         name: currentProject?.name ?? project.name,
          //         validators: currentProject?.validators ?? 0,
          //         nodes: currentProject?.nodes ?? 0,
          //         contributors: parseInt(contributorsAsAString),
          //       })
          //     })
          //   : cy.task("pushData", {
          //       id: project.id,
          //       name: project.name,
          //       contributors: parseInt(contributorsAsAString),
          //     })
        })
        cy.task("getData").then((data) => {
          cy.log(JSON.stringify(data, null, 2))
        })
      })
    }

    if (project.name === "Syscoin") {
      it(`Syscoin`, () => {
        cy.log("Syscoin")
        cy.visit(`https://explorer.syscoin.org/`)
        cy.wait(2000)
        cy.get(".d-flex > .dashboard-banner-network-stats-value")
          .invoke("text")
          .as("totalTransactions")
        cy.get(
          ".dashboard-banner-network-stats-item-4 > .dashboard-banner-network-stats-value"
        )
          .invoke("text")
          .as("totalAddresses")
        cy.get("@totalTransactions").then((totalTransactions) => {
          cy.get("@totalAddresses").then((totalAddresses) => {
            cy.task("getProject", project.id).then((currentProject: any) => {
              cy.task("editData", {
                id: currentProject.id,
                name: currentProject.name,
                validators: currentProject?.validators ?? 0,
                nodes: currentProject?.nodes ?? 0,
                contributors: currentProject?.contributors ?? 0,
                totalTransactions: parseInt(
                  `${totalTransactions}`.replaceAll(",", "")
                ),
                totalAddresses: parseInt(
                  `${totalAddresses}`.replaceAll(",", "")
                ),
              })
            })
          })
        })
        cy.task("getData").then((data) => {
          cy.log(JSON.stringify(data, null, 2))
        })
      })
    }
  }

  // it(`Syscoin`, () => {
  //   cy.visit(`https://explorer.syscoin.org/`)
  //   cy.wait(2000)
  //   cy.get(".d-flex > .dashboard-banner-network-stats-value")
  //     .invoke("text")
  //     .as("totalTransactions")
  //   cy.get(
  //     ".dashboard-banner-network-stats-item-4 > .dashboard-banner-network-stats-value"
  //   )
  //     .invoke("text")
  //     .as("totalAddresses")
  //   cy.get("@totalTransactions").then((totalTransactions) => {
  //     cy.get("@totalAddresses").then((totalAddresses) => {
  //       cy.task("editData", {
  //         projectName: "Syscoin",
  //         totalTransactions: parseInt(
  //           `${totalTransactions}`.replaceAll(",", "")
  //         ),
  //         totalAddresses: parseInt(`${totalAddresses}`.replaceAll(",", "")),
  //       })
  //     })
  //   })
  // })

  // it("Individual GitHub account Testing", () => {
  //   cy.visit(`https://github.com/paritytech/polkadot`)
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

  // it.only("Individual Explorer Testing", () => {
  //   cy.visit("https://avascan.info/stats/staking")
  //   cy.wait(4000)
  //   // cy.xpath("/html/body/div[2]/div/div[2]/div[2]/div[2]/div/div[2]")
  //   cy.get(":nth-child(3) > .statsfigure > .statsfigure-main > span")
  //     .invoke("text")
  //     .as("nodes")
  //   cy.get("@nodes").then((nodes) => {
  //     cy.log(`${nodes}`)
  //     const nodesArray = new String(nodes).split("/")
  //     cy.task("pushData", {
  //       project_id: 21,
  //       name: "Avalanche",
  //       numOfValidators: `${nodesArray[0]}`,
  //     })
  //   })
  // })

  after(() => {
    cy.task("sortData")
    cy.task("getData").then((data: any) => {
      cy.log(data)
      cy.writeFile("projects-analytics.json", data)
    })

    cy.task("cleanUpData")
  })
})
