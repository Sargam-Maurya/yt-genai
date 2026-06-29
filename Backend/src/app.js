const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const helmet = require("helmet")
const compression = require("compression")
const morgan = require("morgan")
const rateLimit = require("express-rate-limit")

const app = express()

// Security headers
app.use(helmet())

// Compression
app.use(compression())

// Request logging
if (process.env.NODE_ENV !== "test") {
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"))
}

// Trust proxy — needed when behind a reverse proxy (Render, Railway, etc.)
app.set("trust proxy", 1)

// Rate limiting
const isProd = process.env.NODE_ENV === "production"
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isProd ? 200 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." },
})
app.use("/api/", limiter)

// Stricter limiter for AI generation endpoint
const generateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: isProd ? 10 : 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many generation requests. Please try again later." },
})
app.use("/api/interview/", generateLimiter)

app.use(express.json({ limit: "5mb" }))
app.use(cookieParser())
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:4173",
].filter(Boolean)

app.use(cors({
    origin: (origin, cb) => {
        // Allow requests with no origin (server-to-server, mobile apps, curl)
        if (!origin) return cb(null, true)
        if (allowedOrigins.includes(origin)) return cb(null, true)
        cb(null, false)
    },
    credentials: true
}))

// Health check — used by deployment platforms (Render, Railway, etc.)
app.get("/health", (req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }))

// require all the routes here
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")

// using all the routes here
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err)
  res.status(err.status || 500).json({
    message: process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message
  })
})

module.exports = app
