const FlowWorkspace = require('../models/flowWorkspace');

// Save a new workspace or update existing
exports.saveWorkspace = async (req, res) => {
  try {
    const { workspaceName, nodes, edges, metadata } = req.body;

    let workspace = await FlowWorkspace.findOne({ workspaceName });

    if (workspace) {
      workspace.nodes = nodes;
      workspace.edges = edges;
      workspace.metadata = metadata;
      await workspace.save();
    } else {
      workspace = new FlowWorkspace({ workspaceName, nodes, edges, metadata });
      await workspace.save();
    }

    res.status(200).json({ message: 'Workspace saved successfully', workspace });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save workspace', details: err.message });
  }
};

// Get a workspace by name
exports.getWorkspace = async (req, res) => {
  try {
    const { name } = req.params;
    const workspace = await FlowWorkspace.findOne({ workspaceName: name });

    if (!workspace) return res.status(404).json({ error: 'Workspace not found' });

    res.status(200).json(workspace);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch workspace', details: err.message });
  }
};

// Get all workspace names
exports.listWorkspaces = async (req, res) => {
  try {
    const workspaces = await FlowWorkspace.find({}, 'workspaceName');
    res.status(200).json(workspaces);
  } catch (err) {
    res.status(500).json({ error: 'Failed to list workspaces', details: err.message });
  }
};

// Delete a workspace
exports.deleteWorkspace = async (req, res) => {
  try {
    const { name } = req.params;
    const result = await FlowWorkspace.findOneAndDelete({ workspaceName: name });

    if (!result) return res.status(404).json({ error: 'Workspace not found' });

    res.status(200).json({ message: 'Workspace deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete workspace', details: err.message });
  }
};
