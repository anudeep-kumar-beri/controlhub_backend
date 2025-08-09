// backend/models/FlowWorkspace.js
const mongoose = require('mongoose');

const flowWorkspaceSchema = new mongoose.Schema(
  {
    userId: {
      type: String, // Future: Reference to User model
      required: false,
      index: true
    },
    workspaceName: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 100,
      index: true
    },
    nodes: {
      type: Array,
      required: true,
      validate: {
        validator: (val) => Array.isArray(val),
        message: 'Nodes must be an array'
      }
    },
    edges: {
      type: Array,
      required: true,
      validate: {
        validator: (val) => Array.isArray(val),
        message: 'Edges must be an array'
      }
    },
    metadata: {
      type: Object,
      default: {}
    }
  },
  {
    timestamps: true // automatically creates createdAt & updatedAt
  }
);

// Optional: Unique constraint for workspace per user
flowWorkspaceSchema.index({ userId: 1, workspaceName: 1 }, { unique: true });

module.exports = mongoose.model('FlowWorkspace', flowWorkspaceSchema);
