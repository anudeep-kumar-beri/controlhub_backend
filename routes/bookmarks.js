// routes/bookmarks.js
const express = require('express');
const router = express.Router();
const Bookmark = require('../models/bookmark');

// GET – Fetch all bookmarks
router.get('/', async (req, res) => {
  try {
    const bookmarks = await Bookmark.find().sort({ createdAt: -1 });
    res.json(bookmarks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookmarks' });
  }
});

// POST – Add new bookmark
router.post('/', async (req, res) => {
  try {
    const { title, url, category } = req.body;
    const newBookmark = await Bookmark.create({ title, url, category });
    res.status(201).json(newBookmark);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add bookmark' });
  }
});

// PUT – Update bookmark
router.put('/:id', async (req, res) => {
  try {
    const { title, url, category } = req.body;
    const updated = await Bookmark.findByIdAndUpdate(
      req.params.id,
      { title, url, category },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update bookmark' });
  }
});

// DELETE – Remove bookmark
router.delete('/:id', async (req, res) => {
  try {
    await Bookmark.findByIdAndDelete(req.params.id);
    res.json({ message: 'Bookmark deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete bookmark' });
  }
});

module.exports = router;
