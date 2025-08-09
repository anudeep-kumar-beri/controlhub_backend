const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const emailjs = require('@emailjs/nodejs'); // Uncomment if used

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
app.use(cors({
  origin: (origin, callback) => {
    try {
      const allowed =
        !origin ||
        origin === 'http://localhost:3000' ||
        origin === 'https://control-hub.netlify.app' ||
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

// Middleware
app.use(express.json());

// Routes
app.use('/api/skills', require('./routes/skills'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/weeklylogs', require('./routes/weeklylogs'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/bookmarks', require('./routes/bookmarks'));
app.use('/api/journal', require('./routes/journal'));
app.use('/api/flow', require('./routes/flow'));

require('./utils/cron');

// Health Check
app.get('/api/ping', (req, res) => res.send('pong'));
app.get('/', (req, res) => res.send('🚀 ControlHub API is running.'));

// MongoDB connection
mongoose.set('strictQuery', true);

if (!process.env.MONGO_URI) {
  console.error('❌ Missing MONGO_URI in environment variables.');
  process.exit(1);
}

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
