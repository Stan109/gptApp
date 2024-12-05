const { Folder } = require('../../models');

// Helper function for validation errors
const validateInput = (input, field) => {
  if (!input || input.trim() === '') {
    return `${field} is required.`;
  }
  return null;
};

// Get all folders for the authenticated user
exports.getFolders = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Unauthorized. User information is missing.' });
    }

    const folders = await Folder.findAll({ where: { user_id: req.user.id } });
    if (!folders.length) {
      return res.status(404).json({ error: 'No folders found for this user.' });
    }

    res.status(200).json(folders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred while fetching folders.' });
  }
};

// Get a specific folder by ID
exports.getFolderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid folder ID.' });
    }

    const folder = await Folder.findOne({ where: { id, user_id: req.user.id } });
    if (!folder) {
      return res.status(404).json({ error: 'Folder not found or you do not have access.' });
    }

    res.status(200).json(folder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred while fetching the folder.' });
  }
};

// Create a new folder
exports.createFolder = async (req, res) => {
  try {
    const { name } = req.body;

    const validationError = validateInput(name, 'Folder name');
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const folder = await Folder.create({
      name: name.trim(),
      user_id: req.user.id,
    });

    res.status(201).json(folder);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => err.message);
      return res.status(400).json({ error: 'Validation failed.', details: errors });
    }
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred while creating the folder.' });
  }
};

// Update an existing folder
exports.updateFolder = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid folder ID.' });
    }

    const validationError = validateInput(name, 'Folder name');
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const folder = await Folder.findOne({ where: { id, user_id: req.user.id } });
    if (!folder) {
      return res.status(404).json({ error: 'Folder not found or you do not have access.' });
    }

    await folder.update({ name: name.trim() });
    res.status(200).json(folder);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => err.message);
      return res.status(400).json({ error: 'Validation failed.', details: errors });
    }
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred while updating the folder.' });
  }
};

// Delete a folder
exports.deleteFolder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid folder ID.' });
    }

    const folder = await Folder.findOne({ where: { id, user_id: req.user.id } });
    if (!folder) {
      return res.status(404).json({ error: 'Folder not found or you do not have access.' });
    }

    await folder.destroy();
    res.status(200).json({ message: 'Folder deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred while deleting the folder.' });
  }
};
