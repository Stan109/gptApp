const { DayTest, User } = require('../../models');

// Helper function to validate inputs
const validateInput = (input, field) => {
  if (!input || input.trim() === '') {
    return `${field} is required.`;
  }
  return null;
};

// Helper function to check if a day test belongs to the current user
const isDayTestOwner = async (dayTestId, userId) => {
  const dayTest = await DayTest.findByPk(dayTestId, { where: { user_id: userId } });
  return !!dayTest; // Returns true if the day test exists and belongs to the user
};

// Create a day test for a user
exports.createDayTest = async (req, res) => {
  try {
    const { date, testResults, notes } = req.body;

    const validationErrors = [
      validateInput(date, 'Date'),
      validateInput(JSON.stringify(testResults), 'Test Results'),
    ].filter((error) => error);

    if (validationErrors.length > 0) {
      return res.status(400).json({ error: 'Validation failed.', details: validationErrors });
    }

    const dayTest = await DayTest.create({
      date,
      testResults,
      notes,
      user_id: req.user.id, // Assume `req.user` contains the authenticated user's info
    });

    res.status(201).json(dayTest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create day test.' });
  }
};

// Get all day tests for the current user
exports.getDayTestsByUser = async (req, res) => {
  try {
    const dayTests = await DayTest.findAll({ where: { user_id: req.user.id } });

    if (!dayTests.length) {
      return res.status(404).json({ error: 'No day tests found for this user.' });
    }

    res.status(200).json(dayTests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch day tests.' });
  }
};

// Update a day test by ID
exports.updateDayTest = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, testResults, notes } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'DayTest ID must be a valid integer.' });
    }

    const dayTest = await DayTest.findByPk(id);
    if (!dayTest) {
      return res.status(404).json({ error: 'Day test not found.' });
    }

    // Check ownership
    const isOwner = await isDayTestOwner(id, req.user.id);
    if (!isOwner) {
      return res.status(403).json({ error: 'Access denied. You do not own this day test.' });
    }

    if (date) dayTest.date = date;
    if (testResults) dayTest.testResults = testResults;
    if (notes) dayTest.notes = notes;

    await dayTest.save();
    res.status(200).json(dayTest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update day test.' });
  }
};

// Delete a day test by ID
exports.deleteDayTest = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'DayTest ID must be a valid integer.' });
    }

    const dayTest = await DayTest.findByPk(id);
    if (!dayTest) {
      return res.status(404).json({ error: 'Day test not found.' });
    }

    // Check ownership
    const isOwner = await isDayTestOwner(id, req.user.id);
    if (!isOwner) {
      return res.status(403).json({ error: 'Access denied. You do not own this day test.' });
    }

    await dayTest.destroy();
    res.status(200).json({ message: 'Day test deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete day test.' });
  }
};
