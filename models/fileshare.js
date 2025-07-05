    const mongoose = require('mongoose');

    const FileShareBoardSchema = new mongoose.Schema({
      version: {
        type: String,
        default: 'v0.0.0'
      },
      changelog: [
        {
          version: { type: String, required: true },
          summary: { type: String, required: true },
          date: { type: String, required: true },
          time: { type: String, required: true }
        }
      ],
      bugs: [
        {
          text: { type: String, required: true },
          status: { type: String, enum: ['Pending', 'In Progress', 'Fixed'], default: 'Pending' }
        }
      ],
      features: [
        {
          text: { type: String, required: true },
          status: { type: String, enum: ['Planned', 'In Progress', 'Complete'], default: 'Planned' },
          link: { type: String } // Optional link for features
        }
      ],
      createdAt: {
        type: Date,
        default: Date.now
      }
    });

    module.exports = mongoose.model('FileShareBoard', FileShareBoardSchema);
    
