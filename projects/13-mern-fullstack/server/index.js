import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3005;
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/mernstack';

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Placeholder tasks route (to be implemented in demo flows)
app.get('/api/tasks', (req, res) => {
  res.json([
    { id: 1, title: 'Sample Task', completed: false, createdAt: new Date() }
  ]);
});

// MongoDB connection (will fail gracefully if MongoDB not available)
mongoose.connect(MONGODB_URL)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection failed:', err.message));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
