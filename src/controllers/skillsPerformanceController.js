const { SkillsPerformance, Metadata, File, Folder } = require('../../models');

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

// Create a skills performance entry
exports.createSkillPerformance = async (req, res) => {
  try {
    const { skill, performance } = req.body;
    const { metadataId } = req.params;

    if (!metadataId || isNaN(metadataId)) {
      return res.status(400).json({ error: 'Metadata ID must be a valid integer.' });
    }

    const validationErrors = [
      validateInput(skill, 'Skill'),
      validateInput(performance, 'Performance'),
    ].filter((error) => error);

    if (validationErrors.length > 0) {
      return res.status(400).json({ error: 'Validation failed.', details: validationErrors });
    }

    if (!['Poor', 'Average', 'Good'].includes(performance)) {
      return res.status(400).json({ error: 'Performance must be one of: Poor, Average, Good.' });
    }

    // Check folder ownership
    const isOwner = await isFolderOwner(metadataId, req.user.id);
    if (!isOwner) {
      return res.status(403).json({ error: 'Access denied. You do not own this metadata.' });
    }

    // Create SkillsPerformance entry
    const skillPerformance = await SkillsPerformance.create({
      skill: skill.trim(),
      performance,
      metadata_id: metadataId,
    });

    res.status(201).json(skillPerformance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create skill performance.' });
  }
};

// Get all skills performance entries by metadata ID
exports.getSkillsByMetadata = async (req, res) => {
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

    const skills = await SkillsPerformance.findAll({ where: { metadata_id: metadataId } });
    if (!skills.length) {
      return res.status(404).json({ error: 'No skills performance found for this metadata.' });
    }

    res.status(200).json(skills);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch skills performance.' });
  }
};

// Update a skill performance entry by ID
exports.updateSkillPerformance = async (req, res) => {
  try {
    const { id } = req.params;
    const { skill, performance } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'SkillPerformance ID must be a valid integer.' });
    }

    const skillPerformance = await SkillsPerformance.findByPk(id, {
      include: {
        model: Metadata,
        as: 'metadata',
      },
    });
    if (!skillPerformance) {
      return res.status(404).json({ error: 'Skill performance not found.' });
    }

    // Check folder ownership via metadata
    const isOwner = await isFolderOwner(skillPerformance.metadata_id, req.user.id);
    if (!isOwner) {
      return res.status(403).json({ error: 'Access denied. You do not own this metadata.' });
    }

    if (skill) skillPerformance.skill = skill.trim();
    if (performance) {
      if (!['Poor', 'Average', 'Good'].includes(performance)) {
        return res.status(400).json({ error: 'Performance must be one of: Poor, Average, Good.' });
      }
      skillPerformance.performance = performance;
    }

    await skillPerformance.save();
    res.status(200).json(skillPerformance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update skill performance.' });
  }
};

// Delete a skill performance entry by ID
exports.deleteSkillPerformance = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'SkillPerformance ID must be a valid integer.' });
    }

    const skillPerformance = await SkillsPerformance.findByPk(id, {
      include: {
        model: Metadata,
        as: 'metadata',
      },
    });
    if (!skillPerformance) {
      return res.status(404).json({ error: 'Skill performance not found.' });
    }

    // Check folder ownership via metadata
    const isOwner = await isFolderOwner(skillPerformance.metadata_id, req.user.id);
    if (!isOwner) {
      return res.status(403).json({ error: 'Access denied. You do not own this metadata.' });
    }

    await skillPerformance.destroy();
    res.status(200).json({ message: 'Skill performance deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete skill performance.' });
  }
};
