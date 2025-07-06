const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
  'http://localhost:3000',
  'https://controlhub-frontend.vercel.app',
];

app.use(cors({
  origin: (origin, callback) => {
    if (
      !origin ||                              // allow Postman/server-side
      allowedOrigins.includes(origin) ||      // allow specific known ones
      /\.vercel\.app$/.test(new URL(origin).hostname) // ✅ any *.vercel.app subdomain
    ) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true
}));


app.use(cors(corsOptions));

// Routes
const skillRoutes = require('./routes/skills');
const fileShareRoutes = require('./routes/fileshare');
const weeklyRoutes = require('./routes/weeklylogs');
const jobRoutes = require('./routes/jobs');
const bookmarkRoutes = require('./routes/bookmarks');
const journalRoutes = require('./routes/journal');

app.use('/api/skills', skillRoutes);
app.use('/api/fileshare', fileShareRoutes);
app.use('/api/weeklylogs', weeklyRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/journal', journalRoutes);

app.get('/api/ping', (req, res) => res.send('pong'));

// Mongo connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/controlhub')
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    );
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));
