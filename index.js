// Load environment variables FIRST
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./db/connectDB");
const authRoutes = require("./routes/auth");
const issueRoutes = require("./routes/issues");

connectDB();

const app = express();

// ✅ FIXED CORS CONFIG
const allowedOrigins = [
  "https://sih-citypulse-vwjy.vercel.app", // frontend
  "http://localhost:5000" // local dev (if needed)
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Ensure OPTIONS requests are handled
app.options("*", cors());

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/issues", issueRoutes);

// Export for Vercel
module.exports = app;
