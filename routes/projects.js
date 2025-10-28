// routes/projects.js
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Project = require('../models/project');

// GET all projects (most-recent first)
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ updatedAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// helper: validate ObjectId
function ensureIdValid(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// GET one project
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (!ensureIdValid(id)) return res.status(400).json({ error: 'Invalid ID' });
  try {
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ error: 'Not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST new project
router.post('/', async (req, res) => {
  try {
    if (!req.body?.name) return res.status(400).json({ error: 'name is required' });
    const newProject = new Project(req.body);
    const saved = await newProject.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT update project (replace fields)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  if (!ensureIdValid(id)) return res.status(400).json({ error: 'Invalid ID' });
  try {
    const updated = await Project.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE project
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  if (!ensureIdValid(id)) return res.status(400).json({ error: 'Invalid ID' });
  try {
    const deleted = await Project.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH description
router.patch('/:id/description', async (req, res) => {
  const { id } = req.params;
  const { description = '' } = req.body || {};
  if (!ensureIdValid(id)) return res.status(400).json({ error: 'Invalid ID' });
  try {
    const updated = await Project.findByIdAndUpdate(id, { description }, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH version
router.patch('/:id/version', async (req, res) => {
  const { id } = req.params;
  const { version = '' } = req.body || {};
  if (!ensureIdValid(id)) return res.status(400).json({ error: 'Invalid ID' });
  try {
    const updated = await Project.findByIdAndUpdate(id, { version }, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Changelog endpoints ---
router.post('/:id/changelog', async (req, res) => {
  const { id } = req.params;
  const { version, summary, date, time } = req.body || {};
  if (!ensureIdValid(id)) return res.status(400).json({ error: 'Invalid ID' });
  if (!version || !summary) return res.status(400).json({ error: 'version and summary required' });
  try {
    const entry = { version, summary, date: date || new Date().toISOString().slice(0,10), time: time || new Date().toTimeString().slice(0,5) };
    const updated = await Project.findByIdAndUpdate(id, { $push: { changelog: entry } }, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.status(201).json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/:id/changelog/:entryId', async (req, res) => {
  const { id, entryId } = req.params;
  if (!ensureIdValid(id) || !ensureIdValid(entryId)) return res.status(400).json({ error: 'Invalid ID' });
  try {
    const { version, summary, date, time } = req.body || {};
    const updated = await Project.findOneAndUpdate(
      { _id: id, 'changelog._id': entryId },
      {
        $set: {
          'changelog.$.version': version,
          'changelog.$.summary': summary,
          ...(date ? { 'changelog.$.date': date } : {}),
          ...(time ? { 'changelog.$.time': time } : {}),
        }
      },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id/changelog/:entryId', async (req, res) => {
  const { id, entryId } = req.params;
  if (!ensureIdValid(id) || !ensureIdValid(entryId)) return res.status(400).json({ error: 'Invalid ID' });
  try {
    const updated = await Project.findByIdAndUpdate(id, { $pull: { changelog: { _id: entryId } } }, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Bugs endpoints ---
router.post('/:id/bugs', async (req, res) => {
  const { id } = req.params;
  const { text, status } = req.body || {};
  if (!ensureIdValid(id)) return res.status(400).json({ error: 'Invalid ID' });
  if (!text) return res.status(400).json({ error: 'text required' });
  try {
    const entry = { text, status: status || 'Pending' };
    const updated = await Project.findByIdAndUpdate(id, { $push: { bugs: entry } }, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.status(201).json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/:id/bugs/:bugId', async (req, res) => {
  const { id, bugId } = req.params;
  if (!ensureIdValid(id) || !ensureIdValid(bugId)) return res.status(400).json({ error: 'Invalid ID' });
  try {
    const { text, status } = req.body || {};
    const set = {};
    if (typeof text === 'string') set['bugs.$.text'] = text;
    if (typeof status === 'string') set['bugs.$.status'] = status;
    const updated = await Project.findOneAndUpdate({ _id: id, 'bugs._id': bugId }, { $set: set }, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id/bugs/:bugId', async (req, res) => {
  const { id, bugId } = req.params;
  if (!ensureIdValid(id) || !ensureIdValid(bugId)) return res.status(400).json({ error: 'Invalid ID' });
  try {
    const updated = await Project.findByIdAndUpdate(id, { $pull: { bugs: { _id: bugId } } }, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Features endpoints ---
router.post('/:id/features', async (req, res) => {
  const { id } = req.params;
  const { text, status, link } = req.body || {};
  if (!ensureIdValid(id)) return res.status(400).json({ error: 'Invalid ID' });
  if (!text) return res.status(400).json({ error: 'text required' });
  try {
    const entry = { text, status: status || 'Planned', link: link || '' };
    const updated = await Project.findByIdAndUpdate(id, { $push: { features: entry } }, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.status(201).json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/:id/features/:featureId', async (req, res) => {
  const { id, featureId } = req.params;
  if (!ensureIdValid(id) || !ensureIdValid(featureId)) return res.status(400).json({ error: 'Invalid ID' });
  try {
    const { text, status, link } = req.body || {};
    const set = {};
    if (typeof text === 'string') set['features.$.text'] = text;
    if (typeof status === 'string') set['features.$.status'] = status;
    if (typeof link === 'string') set['features.$.link'] = link;
    const updated = await Project.findOneAndUpdate({ _id: id, 'features._id': featureId }, { $set: set }, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id/features/:featureId', async (req, res) => {
  const { id, featureId } = req.params;
  if (!ensureIdValid(id) || !ensureIdValid(featureId)) return res.status(400).json({ error: 'Invalid ID' });
  try {
    const updated = await Project.findByIdAndUpdate(id, { $pull: { features: { _id: featureId } } }, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
