const express = require('express');
const router = express.Router();
const WeeklyLog = require('../models/weeklyLog');

// GET All
router.get('/', async (req, res) => {
  try {
    const items = await WeeklyLog.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST Create
router.post('/', async (req, res) => {
  try {
    const newItem = new WeeklyLog(req.body);
    const saved = await newItem.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT Update
router.put('/:id', async (req, res) => {
  try {
    const updated = await WeeklyLog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await WeeklyLog.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
