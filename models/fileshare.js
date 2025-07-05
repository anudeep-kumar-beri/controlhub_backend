const mongoose = require('mongoose');

const FileShareSchema = new mongoose.Schema({
  version: String,
  changelog: [
    {
      version: String,
      date: String,
      time: String,
      summary: String,
    },
  ],
  bugs: [
    {
      text: String,
      status: { type: String, default: 'Pending' },
    },
  ],
  features: [
    {
      text: String,
      status: { type: String, default: 'Planned' },
      link: String,
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('FileShare', FileShareSchema);
