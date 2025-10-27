const WeeklyLog = require('../models/WeeklyLog');

exports.getLogs = async (req, res) => {
  try {
    const logs = await WeeklyLog.find();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addLog = async (req, res) => {
  try {
    const log = new WeeklyLog(req.body);
    await log.save();
    res.status(201).json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateLog = async (req, res) => {
  try {
    const log = await WeeklyLog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteLog = async (req, res) => {
  try {
    await WeeklyLog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Log deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
