const { Metadata, File, Folder } = require('../../models');

// Helper function to validate inputs
const validateInput = (input, field) => {
  if (!input || input.trim() === '') {
    return `${field} is required.`;
  }
  return null;
};

// Helper function to check folder ownership
const isFolderOwner = async (fileId, userId) => {
  const file = await File.findByPk(fileId, {
    include: {
      model: Folder,
      as: 'folder',
      where: { user_id: userId }, // Ensure the folder belongs to the user
    },
  });
  return !!file; // Returns true if file exists and folder is owned by the user
};

// Create metadata for a file
exports.createMetadata = async (req, res) => {
  try {
    const { subject, level, timePassed, notes } = req.body;
    const { fileId } = req.params;

    if (!fileId || isNaN(fileId)) {
      return res.status(400).json({ error: 'File ID must be a valid integer.' });
    }

    const validationErrors = [
      validateInput(subject, 'Subject'),
    ].filter((error) => error);

    if (validationErrors.length > 0) {
      return res.status(400).json({ error: 'Validation failed.', details: validationErrors });
    }

    // Check folder ownership
    const isOwner = await isFolderOwner(fileId, req.user.id);
    if (!isOwner) {
      return res.status(403).json({ error: 'Access denied. You do not own this file.' });
    }

    // Create metadata
    const metadata = await Metadata.create({
      subject: subject.trim(),
      level,
      timePassed,
      notes,
      file_id: fileId,
    });

    res.status(201).json(metadata);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create metadata.' });
  }
};

// Get metadata by file ID
exports.getMetadataByFile = async (req, res) => {
  try {
    const { fileId } = req.params;

    if (!fileId || isNaN(fileId)) {
      return res.status(400).json({ error: 'File ID must be a valid integer.' });
    }

    // Check folder ownership
    const isOwner = await isFolderOwner(fileId, req.user.id);
    if (!isOwner) {
      return res.status(403).json({ error: 'Access denied. You do not own this file.' });
    }

    const metadata = await Metadata.findAll({ where: { file_id: fileId } });
    if (!metadata.length) {
      return res.status(404).json({ error: 'No metadata found for this file.' });
    }

    res.status(200).json(metadata);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch metadata.' });
  }
};

// Update metadata by ID
exports.updateMetadata = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, level, timePassed, notes } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Metadata ID must be a valid integer.' });
    }

    const metadata = await Metadata.findByPk(id);
    if (!metadata) {
      return res.status(404).json({ error: 'Metadata not found.' });
    }

    // Check folder ownership via associated file
    const isOwner = await isFolderOwner(metadata.file_id, req.user.id);
    if (!isOwner) {
      return res.status(403).json({ error: 'Access denied. You do not own this file.' });
    }

    if (subject) metadata.subject = subject.trim();
    if (level) metadata.level = level;
    if (timePassed) metadata.timePassed = timePassed;
    if (notes) metadata.notes = notes;

    await metadata.save();
    res.status(200).json(metadata);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update metadata.' });
  }
};

// Delete metadata by ID
exports.deleteMetadata = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Metadata ID must be a valid integer.' });
    }

    const metadata = await Metadata.findByPk(id);
    if (!metadata) {
      return res.status(404).json({ error: 'Metadata not found.' });
    }

    // Check folder ownership via associated file
    const isOwner = await isFolderOwner(metadata.file_id, req.user.id);
    if (!isOwner) {
      return res.status(403).json({ error: 'Access denied. You do not own this file.' });
    }

    await metadata.destroy();
    res.status(200).json({ message: 'Metadata deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete metadata.' });
  }
};
