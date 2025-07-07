// routes/projects.js
const express = require('express');
const router = express.Router();
const Project = require('../models/project');

// GET all projects
router.get('/', async (req, res) => {
  const projects = await Project.find();
  res.json(projects);
});

// GET one project
router.get('/:id', async (req, res) => {
  const project = await Project.findById(req.params.id);
  res.json(project);
});

// POST new project
router.post('/', async (req, res) => {
  const newProject = new Project(req.body);
  const saved = await newProject.save();
  res.status(201).json(saved);
});

// PUT update project
router.put('/:id', async (req, res) => {
  const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// DELETE project
router.delete('/:id', async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

module.exports = router;
