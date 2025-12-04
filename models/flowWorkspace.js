// models/flowWorkspace.js
const mongoose = require('mongoose');

const flowWorkspaceSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: false,
    index: true
  },
  workspaceName: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  nodes: {
    type: Array,
    required: true,
    default: []
  },
  edges: {
    type: Array,
    required: true,
    default: []
  },
  metadata: {
    type: Object,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('FlowWorkspace', flowWorkspaceSchema);
