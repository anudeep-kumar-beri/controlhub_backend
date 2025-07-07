const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// CORS Configuration
app.use(cors({
  origin: (origin, callback) => {
    try {
      const allowed =
        !origin ||
        origin === 'http://localhost:3000' ||
        origin === 'https://controlhub-frontend.vercel.app' ||
        /\.vercel\.app$/.test(new URL(origin).hostname);

      if (allowed) {
        callback(null, true);
      } else {
        console.warn(`❌ CORS Rejected: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    } catch (e) {
      console.error('❌ CORS Error:', e.message);
      callback(new Error('Invalid origin'));
    }
  },
  credentials: true
}));

// Routes
app.use('/api/skills', require('./routes/skills'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/weeklylogs', require('./routes/weeklylogs'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/bookmarks', require('./routes/bookmarks'));
app.use('/api/journal', require('./routes/journal'));

// ➕ New unified route for multiple projects
app.use('/api/projects', require('./routes/projects'));

require('./cron');

// Health Check
app.get('/api/ping', (req, res) => res.send('pong'));
app.get('/', (req, res) => res.send('🚀 ControlHub API is running.'));

// MongoDB connection
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
  });
