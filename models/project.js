// models/project.js
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  version: String,
  changelog: [
    {
      version: String,
      summary: String,
      date: String,
      time: String,
    },
  ],
  bugs: [
    {
      text: String,
      status: { type: String, enum: ['Pending', 'In Progress', 'Fixed'], default: 'Pending' },
    },
  ],
  features: [
    {
      text: String,
      status: { type: String, enum: ['Planned', 'In Progress', 'Complete'], default: 'Planned' },
      link: String,
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
