const { File, Folder } = require('../../models');
const { Op } = require('sequelize');

// Helper function for validating inputs
const validateInput = (input, field) => {
  if (!input || input.trim() === '') {
    return `${field} is required.`;
  }
  return null;
};

// Helper function to check folder ownership
const isFolderOwner = async (folderId, userId) => {
  const folder = await Folder.findOne({ where: { id: folderId, user_id: userId } });
  return !!folder; // Return true if the folder exists and is owned by the user
};

// Get all files within a folder
exports.getFilesByFolder = async (req, res) => {
  try {
    const { folderId } = req.params;

    if (!folderId || isNaN(folderId)) {
      return res.status(400).json({ error: 'Invalid folder ID.' });
    }

    // Check folder ownership
    const isOwner = await isFolderOwner(folderId, req.user.id);
    if (!isOwner) {
      return res.status(403).json({ error: 'Access denied. You do not own this folder.' });
    }

    const files = await File.findAll({ where: { folder_id: folderId } });
    if (!files.length) {
      return res.status(404).json({ error: 'No files found in this folder.' });
    }

    res.status(200).json(files);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch files.' });
  }
};

// Get a file by ID
exports.getFileById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid file ID.' });
    }

    const file = await File.findByPk(id);
    if (!file) {
      return res.status(404).json({ error: 'File not found.' });
    }

    // Check folder ownership
    const isOwner = await isFolderOwner(file.folder_id, req.user.id);
    if (!isOwner) {
      return res.status(403).json({ error: 'Access denied. You do not own this folder.' });
    }

    res.status(200).json(file);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch the file.' });
  }
};

// Create a new file within a folder
exports.createFile = async (req, res) => {
  try {
    const { name, content } = req.body;
    const { folderId } = req.params;

    const validationErrors = [
      validateInput(name, 'File name'),
      validateInput(content, 'File content'),
    ].filter(error => error);

    if (validationErrors.length > 0) {
      return res.status(400).json({ error: 'Validation failed.', details: validationErrors });
    }

    // Check folder ownership
    const isOwner = await isFolderOwner(folderId, req.user.id);
    if (!isOwner) {
      return res.status(403).json({ error: 'Access denied. You do not own this folder.' });
    }

    const file = await File.create({
      name: name.trim(),
      content,
      folder_id: folderId,
    });

    res.status(201).json(file);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create the file.' });
  }
};

// Update an existing file
exports.updateFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, content } = req.body;

    const file = await File.findByPk(id);
    if (!file) {
      return res.status(404).json({ error: 'File not found.' });
    }

    // Check folder ownership
    const isOwner = await isFolderOwner(file.folder_id, req.user.id);
    if (!isOwner) {
      return res.status(403).json({ error: 'Access denied. You do not own this folder.' });
    }

    if (name) file.name = name.trim();
    if (content) file.content = content;

    await file.save();
    res.status(200).json(file);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update the file.' });
  }
};

// Delete a file
exports.deleteFile = async (req, res) => {
  try {
    const { id } = req.params;

    const file = await File.findByPk(id);
    if (!file) {
      return res.status(404).json({ error: 'File not found.' });
    }

    // Check folder ownership
    const isOwner = await isFolderOwner(file.folder_id, req.user.id);
    if (!isOwner) {
      return res.status(403).json({ error: 'Access denied. You do not own this folder.' });
    }

    await file.destroy();
    res.status(200).json({ message: 'File deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete the file.' });
  }
};
  
