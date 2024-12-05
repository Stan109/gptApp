const { WordsFocused, Metadata, File, Folder } = require('../../models');

// Helper function to validate inputs
const validateInput = (input, field) => {
  if (!input || input.trim() === '') {
    return `${field} is required.`;
  }
  return null;
};

// Helper function to check folder ownership via metadata
const isFolderOwner = async (metadataId, userId) => {
  const metadata = await Metadata.findByPk(metadataId, {
    include: {
      model: File,
      as: 'file',
      include: {
        model: Folder,
        as: 'folder',
        where: { user_id: userId },
      },
    },
  });
  return !!metadata; // Returns true if metadata exists and folder is owned by the user
};

// Create a word focused
exports.createWordFocused = async (req, res) => {
  try {
    const { word, meaning, remembered } = req.body;
    const { metadataId } = req.params;

    if (!metadataId || isNaN(metadataId)) {
      return res.status(400).json({ error: 'Metadata ID must be a valid integer.' });
    }

    const validationErrors = [
      validateInput(word, 'Word'),
      validateInput(meaning, 'Meaning'),
    ].filter((error) => error);

    if (validationErrors.length > 0) {
      return res.status(400).json({ error: 'Validation failed.', details: validationErrors });
    }

    // Check folder ownership
    const isOwner = await isFolderOwner(metadataId, req.user.id);
    if (!isOwner) {
      return res.status(403).json({ error: 'Access denied. You do not own this metadata.' });
    }

    // Create WordsFocused entry
    const wordFocused = await WordsFocused.create({
      word: word.trim(),
      meaning: meaning.trim(),
      remembered: remembered || false,
      metadata_id: metadataId,
    });

    res.status(201).json(wordFocused);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create word focused.' });
  }
};

// Get all words focused by metadata ID
exports.getWordsByMetadata = async (req, res) => {
  try {
    const { metadataId } = req.params;

    if (!metadataId || isNaN(metadataId)) {
      return res.status(400).json({ error: 'Metadata ID must be a valid integer.' });
    }

    // Check folder ownership
    const isOwner = await isFolderOwner(metadataId, req.user.id);
    if (!isOwner) {
      return res.status(403).json({ error: 'Access denied. You do not own this metadata.' });
    }

    const words = await WordsFocused.findAll({ where: { metadata_id: metadataId } });
    if (!words.length) {
      return res.status(404).json({ error: 'No words found for this metadata.' });
    }

    res.status(200).json(words);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch words.' });
  }
};

// Update a word focused by ID
exports.updateWordFocused = async (req, res) => {
  try {
    const { id } = req.params;
    const { word, meaning, remembered } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'WordFocused ID must be a valid integer.' });
    }

    const wordFocused = await WordsFocused.findByPk(id, {
      include: {
        model: Metadata,
        as: 'metadata',
      },
    });
    if (!wordFocused) {
      return res.status(404).json({ error: 'Word focused not found.' });
    }

    // Check folder ownership via metadata
    const isOwner = await isFolderOwner(wordFocused.metadata_id, req.user.id);
    if (!isOwner) {
      return res.status(403).json({ error: 'Access denied. You do not own this metadata.' });
    }

    if (word) wordFocused.word = word.trim();
    if (meaning) wordFocused.meaning = meaning.trim();
    if (typeof remembered === 'boolean') wordFocused.remembered = remembered;

    await wordFocused.save();
    res.status(200).json(wordFocused);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update word focused.' });
  }
};

// Delete a word focused by ID
exports.deleteWordFocused = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'WordFocused ID must be a valid integer.' });
    }

    const wordFocused = await WordsFocused.findByPk(id, {
      include: {
        model: Metadata,
        as: 'metadata',
      },
    });
    if (!wordFocused) {
      return res.status(404).json({ error: 'Word focused not found.' });
    }

    // Check folder ownership via metadata
    const isOwner = await isFolderOwner(wordFocused.metadata_id, req.user.id);
    if (!isOwner) {
      return res.status(403).json({ error: 'Access denied. You do not own this metadata.' });
    }

    await wordFocused.destroy();
    res.status(200).json({ message: 'Word focused deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete word focused.' });
  }
};
