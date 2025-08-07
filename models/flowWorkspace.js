const mongoose = require('mongoose');

const flowWorkspaceSchema = new mongoose.Schema({
  userId: {
    type: String,  // In future: link to user ID if auth is added
    required: false
  },
  workspaceName: {
    type: String,
    required: true
  },
  nodes: {
    type: Array,
    required: true
  },
  edges: {
    type: Array,
    required: true
  },
  metadata: {
    type: Object,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('FlowWorkspace', flowWorkspaceSchema);
