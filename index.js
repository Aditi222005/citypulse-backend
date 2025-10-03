// app.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db/connectDB");
const authRoutes = require("./routes/auth");
const issueRoutes = require("./routes/issues");

connectDB();

const app = express();

/**
 * Allowed origins - list your frontends here (production + preview + local)
 * Add any preview URL variants you use on Vercel if needed.
 */
const allowedOrigins = [
  "https://sih-citypulse-vwjy.vercel.app",
  // Add any other frontend URLs you use while testing:
  "http://localhost:5173",
  "http://localhost:3000"
];

// 1) Global CORS middleware (applies to all routes and OPTIONS)
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like cURL/postman) and allow listed origins
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error("CORS policy: This origin is not allowed"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
  })
);

// 2) Extra: make sure OPTIONS requests are short-circuited BEFORE auth
app.options("*", (req, res) => {
  // If CORS middleware ran above, headers will already be set; return success.
  return res.sendStatus(204);
});

// 3) (Optional) Redundant safe-guard middleware that explicitly sets preflight headers
//    Keeps older clients happy and ensures headers present for debugging.
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin || "");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization,X-Requested-With,Accept");
  }
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// Body parsers after CORS
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ROUTES - ensure authRoutes (login/register) are unprotected and only protected routes check auth
app.use("/api/auth", authRoutes);
app.use("/api/issues", issueRoutes);

// Export app for Vercel or your server wrapper
module.exports = app;
