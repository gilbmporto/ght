const { PrismaClient } = require("@prisma/client")
const data = require("../utils/mock_data.json")
const prisma = new PrismaClient()

async function main() {
  const userId = "user_2brEztHUF6iW3bFo2xXJuhVuXLF"
  const jobs = data.map((job) => ({
    ...job,
    clerkId: userId,
  }))

  for (const job of jobs) {
    await prisma.job.create({
      data: job,
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.log(e)
    await prisma.$disconnect()
    process.exit(1)
  })
