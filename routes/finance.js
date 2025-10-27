const express = require('express');
const router = express.Router();
const { pushRecords, pullChanges } = require('../controllers/financeController');

router.post('/push', pushRecords);
router.get('/pull', pullChanges);

module.exports = router;
