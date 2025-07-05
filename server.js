    const express = require('express');
    const mongoose = require('mongoose');
    const cors = require('cors');
    require('dotenv').config();

    const app = express();
    const PORT = process.env.PORT || 5000;

    // Middleware
    app.use(cors());
    app.use(express.json());

    // Import and Mount routes
    // Ensure these paths and variable names match your actual files
    const skillRoutes = require('./routes/skills');
    const fileShareRoutes = require('./routes/fileshare'); // This imports your fileshare routes
    const weeklyRoutes = require('./routes/weeklylogs');
    const jobRoutes = require('./routes/jobs');
    const bookmarkRoutes = require = ('./routes/bookmarks'); // Corrected typo: '=' instead of ' = '
    const journalRoutes = require('./routes/journal');

    app.use('/api/skills', skillRoutes);
    app.use('/api/fileshare', fileShareRoutes); // This mounts your fileshare routes
    app.use('/api/weeklylogs', weeklyRoutes);
    app.use('/api/jobs', jobRoutes);
    app.use('/api/bookmarks', bookmarkRoutes);
    app.use('/api/journal', journalRoutes);

    // Connect to MongoDB and start server
    mongoose.connect(process.env.MONGO_URI)
      .then(() => {
        console.log('✅ MongoDB connected');
        app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
      })
      .catch(err => console.error('❌ MongoDB connection error:', err));
    
