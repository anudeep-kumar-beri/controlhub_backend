// controllers/flowWorkspaceController.js
const FlowWorkspace = require('../models/flowWorkspace');

/**
 * Create a new workspace
 */
exports.createWorkspace = async (req, res) => {
  try {
    const { userId, workspaceName, nodes = [], edges = [], metadata = {} } = req.body;

    if (!workspaceName?.trim()) {
      return res.status(400).json({ message: 'Workspace name is required' });
    }

    // Ensure workspace is unique for the same user
    const existing = await FlowWorkspace.findOne({ userId, workspaceName });
    if (existing) {
      return res.status(409).json({ message: 'Workspace name already exists for this user' });
    }

    const workspace = new FlowWorkspace({
      userId,
      workspaceName: workspaceName.trim(),
      nodes,
      edges,
      metadata
    });

    await workspace.save();
    return res.status(201).json(workspace);
  } catch (error) {
    console.error('Error creating workspace:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get all workspaces (optionally filtered by userId)
 */
exports.getWorkspaces = async (req, res) => {
  try {
    const { userId } = req.query;
    const filter = userId ? { userId } : {};

    const workspaces = await FlowWorkspace.find(filter).sort({ updatedAt: -1 });
    return res.json(workspaces);
  } catch (error) {
    console.error('Error fetching workspaces:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get a single workspace by ID
 */
exports.getWorkspaceById = async (req, res) => {
  try {
    const workspace = await FlowWorkspace.findById(req.params.id);
    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }
    return res.json(workspace);
  } catch (error) {
    console.error('Error fetching workspace:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Update a workspace
 */
exports.updateWorkspace = async (req, res) => {
  try {
    const { nodes, edges, metadata, workspaceName } = req.body;

    const updateFields = {
      updatedAt: Date.now()
    };

    if (workspaceName) updateFields.workspaceName = workspaceName.trim();
    if (nodes) updateFields.nodes = nodes;
    if (edges) updateFields.edges = edges;
    if (metadata) updateFields.metadata = metadata;

    const updated = await FlowWorkspace.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    return res.json(updated);
  } catch (error) {
    console.error('Error updating workspace:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Delete a workspace
 */
exports.deleteWorkspace = async (req, res) => {
  try {
    const deleted = await FlowWorkspace.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Workspace not found' });
    }
    return res.json({ message: 'Workspace deleted successfully' });
  } catch (error) {
    console.error('Error deleting workspace:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get a workspace by workspaceName (optionally filtered by userId)
 */
exports.getWorkspaceByName = async (req, res) => {
  try {
    const { workspaceName } = req.params;
    const { userId } = req.query;
    const filter = { workspaceName };
    if (userId) filter.userId = userId;

    const workspace = await FlowWorkspace.findOne(filter);
    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }
    return res.json(workspace);
  } catch (error) {
    console.error('Error fetching workspace by name:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};
