const express = require('express');
const router = express.Router();
const Journal = require('../models/journal');

// GET the single journal entry
router.get('/', async (req, res) => {
  try {
    let entry = await Journal.findOne();
    if (!entry) {
      entry = new Journal({ text: '' });
      await entry.save();
    }
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch journal.' });
  }
});

// POST: create or update the singleton journal
router.post('/', async (req, res) => {
  try {
    let entry = await Journal.findOne();
    if (!entry) {
      entry = new Journal({ text: req.body.text });
    } else {
      entry.text = req.body.text;
    }
    await entry.save();
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save journal.' });
  }
});

// DELETE: clear the journal
router.delete('/', async (req, res) => {
  try {
    await Journal.deleteMany({});
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear journal.' });
  }
});

module.exports = router;
