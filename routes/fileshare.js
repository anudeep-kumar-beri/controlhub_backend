const express = require('express');
const router = express.Router();
const FileShare = require('../models/fileshare');

// GET all entries
router.get('/', async (req, res) => {
  try {
    const entries = await FileShare.find();
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new entry
router.post('/', async (req, res) => {
  try {
    const newEntry = new FileShare(req.body);
    const saved = await newEntry.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update entry
router.put('/:id', async (req, res) => {
  try {
    const updated = await FileShare.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE entry
router.delete('/:id', async (req, res) => {
  try {
    await FileShare.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
