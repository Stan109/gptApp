const { User } = require('../../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { RefreshToken } = require('../../models');

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ 
      username,     
      email, 
      password: hashedPassword, // Store hashed password
      role 
    });

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Admins only' });
    }

    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get a single user by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== 'admin' && req.user.id !== parseInt(id, 10)) {
      return res.status(403).json({ error: 'Forbidden: Not authorized' });
    }

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, role } = req.body;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.update({ username, email, role });
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.destroy();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

// Login

exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Find the user
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(404).json({ error: 'User not found' });
  
      // Validate password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) return res.status(401).json({ error: 'Invalid credentials' });
  
      // Generate access token
      const accessToken = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      // Generate refresh token
      const refreshToken = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' } // Refresh token valid for 7 days
      );
  
      // Save refresh token in the database
      await RefreshToken.create({ token: refreshToken, userId: user.id });
  
      res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to login' });
    }
  };

  exports.refreshToken = async (req, res) => {
    try {
      const { refreshToken } = req.body;
  
      // Check if the refresh token exists in the database
      const tokenRecord = await RefreshToken.findOne({ where: { token: refreshToken } });
      if (!tokenRecord) return res.status(401).json({ error: 'Invalid refresh token' });
  
      // Verify the refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
  
      // Generate a new access token
      const newAccessToken = jwt.sign(
        { id: decoded.id, role: decoded.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to refresh token' });
    }
  };
  
