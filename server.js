const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    if (
      origin &&
      (origin.endsWith('.vercel.app') || allowedOrigins.includes(origin))
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Import and Mount routes
const skillRoutes = require('./routes/skills');
const fileShareRoutes = require('./routes/fileshare');
const weeklyRoutes = require('./routes/weeklylogs');
const jobRoutes = require('./routes/jobs');
const bookmarkRoutes = require('./routes/bookmarks');
const journalRoutes = require('./routes/journal');

// Mount routes to specific API paths
app.use('/api/skills', skillRoutes);
app.use('/api/fileshare', fileShareRoutes);
app.use('/api/weeklylogs', weeklyRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/journal', journalRoutes);

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/controlhub', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected');
  app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
})
.catch(err => console.error('❌ MongoDB connection error:', err));
