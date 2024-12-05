const express = require('express');
const router = express.Router();
const dayTestController = require('../controllers/dayTestController');
const authMiddleware = require('../middlewares/authMiddleware');

// Create a day test
router.post('/', authMiddleware.authenticate, dayTestController.createDayTest);

// Get all day tests for the current user
router.get('/', authMiddleware.authenticate, dayTestController.getDayTestsByUser);

// Update a day test by ID
router.put('/:id', authMiddleware.authenticate, dayTestController.updateDayTest);

// Delete a day test by ID
router.delete('/:id', authMiddleware.authenticate, dayTestController.deleteDayTest);

module.exports = router;
