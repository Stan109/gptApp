const express = require('express');
const router = express.Router();
const filesController = require('../controllers/filesController');
const authMiddleware = require('../middlewares/authMiddleware');

// Get all files in a folder
router.get('/folder/:folderId', authMiddleware.authenticate, filesController.getFilesByFolder);

// Get a file by ID
router.get('/:id', authMiddleware.authenticate, filesController.getFileById);

// Create a new file in a folder
router.post('/folder/:folderId', authMiddleware.authenticate, filesController.createFile);

// Update an existing file
router.put('/:id', authMiddleware.authenticate, filesController.updateFile);

// Delete a file
router.delete('/:id', authMiddleware.authenticate, filesController.deleteFile);

module.exports = router;
