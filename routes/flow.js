// routes/flow.js
const express = require('express');
const router = express.Router();
const flowController = require('../controllers/flowController');

// Test route
router.get('/', (req, res) => {
  res.send('Flow API is working');
});

router.post('/save', flowController.saveWorkspace);
router.get('/:name', flowController.getWorkspace);
router.delete('/:name', flowController.deleteWorkspace);
router.get('/list/all', flowController.listWorkspaces); // changed path to avoid conflict with /:name

module.exports = router;
