const express = require('express');
const router = express.Router();
const flowWorkspaceController = require('../controllers/flowController');

// Create workspace
router.post('/', flowWorkspaceController.createWorkspace);

// Get all workspaces (optional ?userId= query)
router.get('/', flowWorkspaceController.getWorkspaces);

// Get a single workspace
router.get('/:id', flowWorkspaceController.getWorkspaceById);

// Update workspace
router.put('/:id', flowWorkspaceController.updateWorkspace);

// Delete workspace
router.delete('/:id', flowWorkspaceController.deleteWorkspace);

// Get a workspace by workspaceName (optionally with ?userId=)
router.get('/by-name/:workspaceName', flowWorkspaceController.getWorkspaceByName);

module.exports = router;
