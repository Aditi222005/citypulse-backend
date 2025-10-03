// index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db/connectDB");
const authRoutes = require("./routes/auth");
const issueRoutes = require("./routes/issues");

connectDB();
const app = express();

const allowedOrigins = [
  "https://sih-citypulse-vwjy.vercel.app",
  /\.vercel\.app$/,            // ✅ allow all Vercel preview deployments
  "http://localhost:5173",
  "http://localhost:3000"
];

// ✅ Global CORS middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow Postman/curl
      if (
        allowedOrigins.includes(origin) ||
        /\.vercel\.app$/.test(origin)
      ) {
        return callback(null, true);
      }
      // ❌ Old: callback(new Error("CORS not allowed for this origin"));
      // ✅ New: just deny, don’t crash
      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Preflight support
app.options("*", cors());

// ✅ Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/issues", issueRoutes);

module.exports = app;