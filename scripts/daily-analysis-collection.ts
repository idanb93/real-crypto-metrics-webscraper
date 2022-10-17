import { exec } from "child_process"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  exec(
    `cd ${process.env.PROJECT_FOLDER} && npx cypress run --browser chrome`,
    (error, stdout) => {
      if (error != null) {
        console.log(`error: ${error.message}`)
      } else {
        console.log(stdout)
        console.log("Finished running the script")
      }
    }
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
