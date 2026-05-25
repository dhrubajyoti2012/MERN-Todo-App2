const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const todoRoutes = require('./routes/todoRoutes');

const app = express();
const PORT = process.env.PORT || 5000;  // ✅ Changed: Now uses env variable

// Allow multiple origins
const allowedOrigins = [
  'http://localhost:3000',           // Local development
  'http://localhost:5173',           // Vite local
  'https://your-frontend.vercel.app' // Production (replace later)
];

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// ✅ CHANGED: Now uses environment variable for Atlas connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('✅ Connected to MongoDB Atlas Successfully!'))
.catch((err) => console.error('❌ MongoDB Atlas Connection Error:', err));

// Routes
app.use('/api/todos', todoRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'MERN Todo API is running on Atlas!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});