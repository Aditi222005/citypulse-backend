// Load environment variables FIRST
const dotenv = require('dotenv');
dotenv.config();

// Now, require other modules
const express = require('express');
const cors = require('cors');
const connectDB = require('./db/connectDB');
const authRoutes = require('./routes/auth');
const issueRoutes = require('./routes/issues');

// Connect to database
connectDB();

const app = express();

// --- Middleware ---

// *** THIS IS THE FIX ***
// Configure CORS to only allow requests from your deployed frontend
app.use(cors({
    origin: 'https://sih-citypulse-vwjy.vercel.app/', // Correct frontend URL
    credentials: true
}));

// Parsers for JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);


// Export the app for Vercel's serverless environment
module.exports = app;

