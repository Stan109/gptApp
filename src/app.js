require('dotenv').config();

const express = require('express');
const { sequelize } = require('../models');
const routes = require('./routes');
const app = express();

app.use(express.json());

// General routes under '/api'
app.use('/api', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
    },
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
  });
});

// Sync database (conditionally for production/dev)
if (process.env.NODE_ENV !== 'production') {
  sequelize.sync({ alter: true }).then(() => {
    console.log('Database synced');
  });
} else {
  sequelize.sync(); // Safe for production
}

module.exports = app;
