const express = require('express');
const router = express.Router();
const skillsPerformanceController = require('../controllers/skillsPerformanceController');
const authMiddleware = require('../middlewares/authMiddleware');

// Create a skill performance for a specific metadata
router.post('/metadata/:metadataId', authMiddleware.authenticate, skillsPerformanceController.createSkillPerformance);

// Get all skills performance for a specific metadata
router.get('/metadata/:metadataId', authMiddleware.authenticate, skillsPerformanceController.getSkillsByMetadata);

// Update a skill performance entry by ID
router.put('/:id', authMiddleware.authenticate, skillsPerformanceController.updateSkillPerformance);

// Delete a skill performance entry by ID
router.delete('/:id', authMiddleware.authenticate, skillsPerformanceController.deleteSkillPerformance);

module.exports = router;
