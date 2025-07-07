const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: String,
  progress: { type: Number, default: 0 },
  description: { type: String, default: '' }  
}, { timestamps: true });


module.exports = mongoose.model('Skill', SkillSchema);
