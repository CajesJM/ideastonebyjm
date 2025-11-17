import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

// Demo data storage (in-memory for demo)
const demoData = {
  users: [],
  subscriptions: [],
  transactions: []
};

// Make demo data available to routes
app.set('demoData', demoData);

// Import routes
import subscriptionRoutes from './routes/subscriptions.js';
import paymentRoutes from './routes/payments.js';
import authRoutes from './routes/auth.js';

// Use routes
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'IdeaStone API is running',
    mode: process.env.NODE_ENV || 'development'
  });
});

// Serve frontend for all other routes (for production)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`🔧 Mode: ${process.env.NODE_ENV === 'development' ? 'DEVELOPMENT (Demo)' : 'PRODUCTION'}`);
});

export default app;