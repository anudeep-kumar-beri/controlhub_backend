const express = require('express');
const router = express.Router();
const Model = require('../models/journal');

// GET all
router.get('/', async (req, res) => {
  const items = await Model.find();
  res.json(items);
});

// POST create
router.post('/', async (req, res) => {
  const newItem = new Model(req.body);
  const saved = await newItem.save();
  res.json(saved);
});

// PUT update
router.put('/:id', async (req, res) => {
  const updated = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// DELETE
router.delete('/:id', async (req, res) => {
  await Model.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

module.exports = router;
