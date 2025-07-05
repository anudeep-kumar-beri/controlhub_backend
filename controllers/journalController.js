const Journal = require('../models/Journal');

exports.getEntries = async (req, res) => {
  try {
    const entries = await Journal.find();
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addEntry = async (req, res) => {
  try {
    const entry = new Journal(req.body);
    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateEntry = async (req, res) => {
  try {
    const entry = await Journal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
