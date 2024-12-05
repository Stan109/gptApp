const express = require('express');
const router = express.Router();
const usersRoutes = require('./users');
const foldersRoutes = require('./folders');
const filesRoutes = require('./files');
const metaDataRoutes = require('./metadata');
const wordFocused = require('./wordsFocused');
const skillsPerformance = require('./skillsPerformance');
const dayTests = require('./dayTests');

// Base API route
router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the backend service!' });
});

// Register entity-specific routes
router.use('/users', usersRoutes);
router.use('/folders', foldersRoutes);
router.use('/files', filesRoutes);
router.use('/metadata', metaDataRoutes);
router.use('/wordsFocused', wordFocused);
router.use('/skillsPerformance', skillsPerformance);
router.use('/dayTests', dayTests);

module.exports = router;
