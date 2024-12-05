const express = require('express');
const router = express.Router();
const foldersController = require('../controllers/foldersController');
const authMiddleware = require('../middlewares/authMiddleware');

// Get all folders
router.get('/', authMiddleware.authenticate, foldersController.getFolders);

// Get a specific folder by ID
router.get('/:id', authMiddleware.authenticate, foldersController.getFolderById);

// Create a new folder
router.post('/', authMiddleware.authenticate, foldersController.createFolder);

// Update an existing folder
router.put('/:id', authMiddleware.authenticate, foldersController.updateFolder);

// Delete a folder
router.delete('/:id', authMiddleware.authenticate, foldersController.deleteFolder);

module.exports = router;
