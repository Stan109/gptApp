const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const authMiddleware = require('../middlewares/authMiddleware');

// User routes
router.post('/', usersController.createUser); // Public route
router.get('/', authMiddleware.authenticate, authMiddleware.isAdmin, usersController.getAllUsers); // Admin only
router.get('/:id', authMiddleware.authenticate, authMiddleware.isOwnerOrAdmin, usersController.getUserById); // Admin or owner
router.put('/:id', authMiddleware.authenticate, authMiddleware.isOwnerOrAdmin, usersController.updateUser); // Admin or owner
router.delete('/:id', authMiddleware.authenticate, authMiddleware.isOwnerOrAdmin, usersController.deleteUser); // Admin or owner
router.post('/login', usersController.login); // Public route
router.post('/refresh-token', usersController.refreshToken);


module.exports = router;