const express = require('express');
const router = express.Router();
const { pushRecords, pullChanges, getSummary } = require('../controllers/financeController');

router.post('/push', pushRecords);
router.get('/pull', pullChanges);
router.get('/summary', getSummary);

module.exports = router;
