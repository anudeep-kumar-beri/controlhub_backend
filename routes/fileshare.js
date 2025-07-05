    const express = require('express');
    const router = express.Router();
    // IMPORTANT: This line correctly imports the Mongoose model from the 'models' directory.
    const FileShareBoard = require('../models/FileShareBoard'); 

    // @route   GET /api/fileshare
    // @desc    Get the single file share board document. If none exists, create a default.
    // @access  Public
    router.get('/', async (req, res) => {
      try {
        let board = await FileShareBoard.findOne(); // Attempt to find one board document

        if (!board) {
          // If no board document is found, create a default one
          console.warn('No existing FileShareBoard document found. Creating a default one.');
          board = new FileShareBoard({
            version: 'v0.0.1',
            changelog: [{ 
              version: 'v0.0.1', 
              summary: 'Initial project board created.', 
              date: new Date().toISOString().split('T')[0], 
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
            }],
            bugs: [],
            features: []
          });
          await board.save(); // Save the newly created board to the database
        }
        res.json(board); // Send back the single board document (either found or newly created)
      } catch (err) {
        console.error('Error in GET /api/fileshare:', err.message);
        res.status(500).json({ error: 'Server Error fetching or creating board.' });
      }
    });

    // @route   POST /api/fileshare
    // @desc    Create a new file share board. This route is typically used for initial creation
    //          if the GET route doesn't auto-create, or if you want to explicitly reset.
    //          Your frontend might not call this directly if GET handles creation.
    // @access  Public
    router.post('/', async (req, res) => {
      try {
        const existingBoard = await FileShareBoard.findOne();
        if (existingBoard) {
          return res.status(400).json({ msg: 'File share board already exists. Use PUT to update.' });
        }

        const { version, changelog, bugs, features } = req.body;
        const newBoard = new FileShareBoard({
          version: version || 'v1.0.0',
          changelog: changelog || [],
          bugs: bugs || [],
          features: features || []
        });

        const board = await newBoard.save();
        res.status(201).json(board);
      } catch (err) {
        console.error('Error in POST /api/fileshare:', err.message);
        res.status(500).json({ error: 'Server Error creating board.' });
      }
    });

    // @route   PUT /api/fileshare/:id
    // @desc    Update the single file share board document
    // @access  Public
    router.put('/:id', async (req, res) => {
      const { version, changelog, bugs, features } = req.body;
      const updatedFields = {};
      // Only add fields to update if they are provided in the request body
      if (version !== undefined) updatedFields.version = version;
      if (changelog !== undefined) updatedFields.changelog = changelog;
      if (bugs !== undefined) updatedFields.bugs = bugs;
      if (features !== undefined) updatedFields.features = features;

      try {
        // Find and update the board by its ID
        const board = await FileShareBoard.findByIdAndUpdate(
          req.params.id,
          { $set: updatedFields }, // Use $set to update specific fields
          { new: true, runValidators: true } // 'new: true' returns the updated document; 'runValidators' ensures schema validation
        );

        if (!board) {
          return res.status(404).json({ msg: 'Board not found' });
        }

        res.json(board); // Send back the updated board document
      } catch (err) {
        console.error('Error in PUT /api/fileshare/:id:', err.message);
        res.status(500).json({ error: 'Server Error updating board.' });
      }
    });

    // @route   DELETE /api/fileshare/:id
    // @desc    Delete the file share board document (use with extreme caution!)
    // @access  Public
    router.delete('/:id', async (req, res) => {
      try {
        const board = await FileShareBoard.findByIdAndDelete(req.params.id);
        if (!board) {
          return res.status(404).json({ msg: 'Board not found' });
        }
        res.status(204).send(); // Send a 204 No Content status for successful deletion
      } catch (err) {
        console.error('Error in DELETE /api/fileshare/:id:', err.message);
        res.status(500).json({ error: 'Server Error deleting board.' });
      }
    });

    module.exports = router;
    
