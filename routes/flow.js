const express = require('express');
const router = express.Router();
const flowController = require('../controllers/flowController');

router.post('/save', flowController.saveWorkspace);
router.get('/:name', flowController.getWorkspace);
router.get('/', flowController.listWorkspaces);
router.delete('/:name', flowController.deleteWorkspace);

module.exports = router;
