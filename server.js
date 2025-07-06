const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'https://controlhub-frontend-cbegxqxtu-anudeep-kumar-beris-projects.vercel.app',
  credentials: true // Only if you use cookies or authentication headers
}));
app.use(express.json());

// Import and Mount routes
// Ensure these paths and variable names match your actual filenames in the 'routes' folder
const skillRoutes = require('./routes/skills');
const fileShareRoutes = require('./routes/fileshare');
const weeklyRoutes = require('./routes/weeklylogs');
const jobRoutes = require('./routes/jobs');
const bookmarkRoutes = require('./routes/bookmarks'); // This line is now correct
const journalRoutes = require('./routes/journal');

// Mount routes to specific API paths
app.use('/api/skills', skillRoutes);
app.use('/api/fileshare', fileShareRoutes);
app.use('/api/weeklylogs', weeklyRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/journal', journalRoutes);

// Connect to MongoDB and start server
// The '||' provides a fallback to localhost for local development if MONGO_URI is not set
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/controlhub', {
  // These options are deprecated in newer Mongoose versions but harmless to include
  // for compatibility across environments.
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected');
  // Listen on the port provided by Render (process.env.PORT) or 5000 locally
  app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
})
.catch(err => console.error('❌ MongoDB connection error:', err));
