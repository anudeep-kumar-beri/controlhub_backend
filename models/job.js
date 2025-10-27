const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  role: String,
  company: String,
  location: String,
  status: String,
  link: String
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);
