// models/journal.js
const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Journal', journalSchema);
