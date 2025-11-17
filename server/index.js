const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

// Routes
app.use('/api/subscriptions', require('./routes/subscriptions'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/auth', require('./routes/auth'));

// Demo data storage (in production, use a real database)
const demoData = {
  users: [],
  subscriptions: [],
  transactions: []
};

// Make demo data available to routes
app.set('demoData', demoData);

// Serve frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Demo mode: ${process.env.NODE_ENV === 'development' ? 'ACTIVE' : 'PRODUCTION'}`);
});

module.exports = app;