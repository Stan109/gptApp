const express = require('express');
const router = express.Router();
const metadataController = require('../controllers/metadataController');
const authMiddleware = require('../middlewares/authMiddleware');

// Create metadata for a file
router.post('/file/:fileId', authMiddleware.authenticate, metadataController.createMetadata);

// Get all metadata for a specific file
router.get('/file/:fileId', authMiddleware.authenticate, metadataController.getMetadataByFile);

// Update metadata by ID
router.put('/:id', authMiddleware.authenticate, metadataController.updateMetadata);

// Delete metadata by ID
router.delete('/:id', authMiddleware.authenticate, metadataController.deleteMetadata);

module.exports = router;
