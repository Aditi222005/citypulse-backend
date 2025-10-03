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

// Middleware
// --- THIS IS THE IMPORTANT CHANGE ---
// It tells your backend to only accept requests from your deployed frontend.
app.use(cors({
    origin: 'https://citypulse-backend-git-main-aditisjoshi2005-gmailcoms-projects.vercel.app/', // <-- VERY IMPORTANT: Replace this with your actual frontend URL!
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);

// Export the app for Vercel's serverless environment
module.exports = app;
