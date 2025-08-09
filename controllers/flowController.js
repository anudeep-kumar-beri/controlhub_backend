const FlowWorkspace = require('../models/flowWorkspace');

// Create a new workspace
exports.createWorkspace = async (req, res) => {
  try {
    const { userId, workspaceName, nodes = [], edges = [], metadata = {} } = req.body;

    if (!workspaceName) {
      return res.status(400).json({ message: 'Workspace name is required' });
    }

    const existing = await FlowWorkspace.findOne({ workspaceName });
    if (existing) {
      return res.status(409).json({ message: 'Workspace name already exists' });
    }

    const workspace = new FlowWorkspace({
      userId,
      workspaceName,
      nodes,
      edges,
      metadata
    });

    await workspace.save();
    res.status(201).json(workspace);
  } catch (error) {
    console.error('Error creating workspace:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all workspaces
exports.getWorkspaces = async (req, res) => {
  try {
    const { userId } = req.query;
    const filter = userId ? { userId } : {};

    const workspaces = await FlowWorkspace.find(filter).sort({ updatedAt: -1 });
    res.json(workspaces);
  } catch (error) {
    console.error('Error fetching workspaces:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single workspace by ID
exports.getWorkspaceById = async (req, res) => {
  try {
    const workspace = await FlowWorkspace.findById(req.params.id);
    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }
    res.json(workspace);
  } catch (error) {
    console.error('Error fetching workspace:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a workspace
exports.updateWorkspace = async (req, res) => {
  try {
    const { nodes, edges, metadata, workspaceName } = req.body;

    const updated = await FlowWorkspace.findByIdAndUpdate(
      req.params.id,
      {
        ...(workspaceName && { workspaceName }),
        ...(nodes && { nodes }),
        ...(edges && { edges }),
        ...(metadata && { metadata }),
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    res.json(updated);
  } catch (error) {
    console.error('Error updating workspace:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a workspace
exports.deleteWorkspace = async (req, res) => {
  try {
    const deleted = await FlowWorkspace.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Workspace not found' });
    }
    res.json({ message: 'Workspace deleted successfully' });
  } catch (error) {
    console.error('Error deleting workspace:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
