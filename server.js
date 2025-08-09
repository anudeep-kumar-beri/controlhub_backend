const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const emailjs = require('@emailjs/nodejs');

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

const flowRoutes = require('./routes/flow');

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
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');

    // --- New Code: Check for and create a default workspace ---
    const FlowWorkspace = require('./models/flowWorkspace');
    FlowWorkspace.findOne({ workspaceName: 'Default' })
      .then(defaultWorkspace => {
        if (!defaultWorkspace) {
          const newWorkspace = new FlowWorkspace({
            workspaceName: 'Default',
            nodes: [],
            edges: []
          });
          newWorkspace.save().then(() => {
            console.log('✨ Default workspace created automatically.');
          }).catch(err => {
            console.error('❌ Failed to create default workspace:', err);
          });
        }
      })
      .catch(err => {
        console.error('❌ Failed to check for default workspace:', err);
      });
    // --- End New Code ---

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
  });