const express = require('express');
const router = express.Router();
const flowWorkspaceController = require('../controllers/flowController');

// Corrected Order: Most specific routes first
// Get a workspace by workspaceName
router.get('/by-name/:workspaceName', flowWorkspaceController.getWorkspaceByName);

// Update workspace by workspaceName (new route for saving)
router.put('/by-name/:workspaceName', flowWorkspaceController.updateWorkspaceByName);

// -----------------------------------------------------------
// Remaining routes (order doesn't matter as much for these now)
// Create a new workspace
router.post('/', flowWorkspaceController.createWorkspace);

// Get all workspaces
router.get('/', flowWorkspaceController.getWorkspaces);

// Get a single workspace by ID
router.get('/:id', flowWorkspaceController.getWorkspaceById);

// Update a workspace by ID
router.put('/:id', flowWorkspaceController.updateWorkspace);

// Delete a workspace by ID
router.delete('/:id', flowWorkspaceController.deleteWorkspace);


module.exports = router;