const mongoose = require('mongoose');

const WeeklyLogSchema = new mongoose.Schema({
  weekRange: String,
  objectives: [String]
}, { timestamps: true });

module.exports = mongoose.model('WeeklyLog', WeeklyLogSchema);
