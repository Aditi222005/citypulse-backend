// index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db/connectDB");
const authRoutes = require("./routes/auth");
const issueRoutes = require("./routes/issues");

connectDB();
const app = express();

// Allowed frontend origins
const allowedOrigins = [
  "https://sih-citypulse-vwjy.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000"
];

// ✅ Global CORS middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow Postman/cURL etc.
      
      // ✅ Exact match OR regex check for any *.vercel.app domain
      if (
        allowedOrigins.includes(origin) ||
        /\.vercel\.app$/.test(origin)
      ) {
        return callback(null, true);
      }

      // ❌ Don't throw error → just deny
      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Always respond to preflight without hitting auth
app.options("*", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  return res.sendStatus(200);
});

// ✅ Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/issues", issueRoutes);

module.exports = app;
