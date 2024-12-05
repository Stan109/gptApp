const express = require('express');
const router = express.Router();
const wordsFocusedController = require('../controllers/wordsFocusedController');
const authMiddleware = require('../middlewares/authMiddleware');

// Create a word focused for a specific metadata
router.post('/metadata/:metadataId', authMiddleware.authenticate, wordsFocusedController.createWordFocused);

// Get all words focused for a specific metadata
router.get('/metadata/:metadataId', authMiddleware.authenticate, wordsFocusedController.getWordsByMetadata);

// Update a word focused by ID
router.put('/:id', authMiddleware.authenticate, wordsFocusedController.updateWordFocused);

// Delete a word focused by ID
router.delete('/:id', authMiddleware.authenticate, wordsFocusedController.deleteWordFocused);

module.exports = router;
