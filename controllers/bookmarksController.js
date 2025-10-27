const Bookmark = require('../models/Bookmark');

exports.getBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find();
    res.json(bookmarks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addBookmark = async (req, res) => {
  try {
    const bookmark = new Bookmark(req.body);
    await bookmark.save();
    res.status(201).json(bookmark);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteBookmark = async (req, res) => {
  try {
    await Bookmark.findByIdAndDelete(req.params.id);
    res.json({ message: 'Bookmark deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
