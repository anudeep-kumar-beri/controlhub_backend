// controllers/flowController.js
const FlowWorkspace = require('../models/flowWorkspace');

exports.saveWorkspace = async (req, res) => {
  try {
    const { workspaceName, nodes, edges, metadata } = req.body;

    // Validation
    if (!workspaceName || typeof workspaceName !== 'string' || workspaceName.trim().length === 0) {
      return res.status(400).json({ error: 'Valid workspace name is required' });
    }

    if (!Array.isArray(nodes)) {
      return res.status(400).json({ error: 'Nodes must be an array' });
    }

    if (!Array.isArray(edges)) {
      return res.status(400).json({ error: 'Edges must be an array' });
    }

    // Sanitize workspace name
    const sanitizedName = workspaceName.trim();

    // Limit nodes and edges to prevent abuse
    if (nodes.length > 500) {
      return res.status(400).json({ error: 'Maximum 500 nodes allowed per workspace' });
    }

    if (edges.length > 1000) {
      return res.status(400).json({ error: 'Maximum 1000 edges allowed per workspace' });
    }

    let workspace = await FlowWorkspace.findOne({ workspaceName: sanitizedName });

    if (workspace) {
      workspace.nodes = nodes;
      workspace.edges = edges;
      workspace.metadata = metadata || {};
      workspace.updatedAt = Date.now();
      await workspace.save();
    } else {
      workspace = new FlowWorkspace({ 
        workspaceName: sanitizedName, 
        nodes, 
        edges, 
        metadata: metadata || {} 
      });
      await workspace.save();
    }

    res.status(200).json({ 
      message: 'Workspace saved successfully', 
      workspace: {
        workspaceName: workspace.workspaceName,
        nodeCount: workspace.nodes.length,
        edgeCount: workspace.edges.length,
        createdAt: workspace.createdAt,
        updatedAt: workspace.updatedAt || workspace.createdAt
      }
    });
  } catch (err) {
    console.error('Save workspace error:', err);
    res.status(500).json({ error: 'Failed to save workspace', details: err.message });
  }
};

exports.getWorkspace = async (req, res) => {
  try {
    const { name } = req.params;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Valid workspace name is required' });
    }

    const workspace = await FlowWorkspace.findOne({ workspaceName: name });

    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    res.status(200).json(workspace);
  } catch (err) {
    console.error('Get workspace error:', err);
    res.status(500).json({ error: 'Failed to fetch workspace', details: err.message });
  }
};

exports.listWorkspaces = async (req, res) => {
  try {
    const { page = 1, limit = 50, sortBy = 'createdAt', order = 'desc' } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const sortOrder = order === 'asc' ? 1 : -1;
    const sortOptions = { [sortBy]: sortOrder };

    const workspaces = await FlowWorkspace.find({}, 'workspaceName createdAt')
      .sort(sortOptions)
      .limit(limitNum)
      .skip(skip);

    const total = await FlowWorkspace.countDocuments();

    res.status(200).json({
      workspaces,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (err) {
    console.error('List workspaces error:', err);
    res.status(500).json({ error: 'Failed to list workspaces', details: err.message });
  }
};

exports.deleteWorkspace = async (req, res) => {
  try {
    const { name } = req.params;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Valid workspace name is required' });
    }

    const result = await FlowWorkspace.findOneAndDelete({ workspaceName: name });

    if (!result) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    res.status(200).json({ 
      message: 'Workspace deleted successfully',
      deletedWorkspace: result.workspaceName
    });
  } catch (err) {
    console.error('Delete workspace error:', err);
    res.status(500).json({ error: 'Failed to delete workspace', details: err.message });
  }
};
