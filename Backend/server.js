require("dotenv").config()
const app = require("./src/app")
const connectToDB = require("./src/config/database")

const PORT = process.env.PORT || 3000

async function start() {
  await connectToDB()

  const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`)
  })

  // Graceful shutdown
  const shutdown = async (signal) => {
    console.log(`\n${signal} received. Shutting down gracefully...`)
    server.close(async () => {
      const mongoose = require("mongoose")
      await mongoose.connection.close()
      console.log("MongoDB connection closed.")
      process.exit(0)
    })
    // Force close after 10s
    setTimeout(() => {
      console.error("Forced shutdown after timeout.")
      process.exit(1)
    }, 10000)
  }

  process.on("SIGTERM", () => shutdown("SIGTERM"))
  process.on("SIGINT", () => shutdown("SIGINT"))
}

start().catch((err) => {
  console.error("Failed to start server:", err)
  process.exit(1)
})
