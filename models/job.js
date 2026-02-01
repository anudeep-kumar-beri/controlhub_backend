const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  role: String,
  company: String,
  location: String,
  status: String,
  link: String,
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' }
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);
