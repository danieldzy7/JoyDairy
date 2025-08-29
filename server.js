const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Enhanced CORS configuration for mobile
app.use(cors({
  origin: true, // Allow all origins in production
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));

app.use(express.json({ limit: '10mb' }));

// Add request logging for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`, {
    body: req.method === 'POST' ? req.body : undefined,
    headers: req.headers['user-agent'] || 'Unknown'
  });
  next();
});

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/joydairy', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/entries', require('./routes/entries'));
app.use('/api/affirmations', require('./routes/affirmations'));
app.use('/api/moods', require('./routes/moods'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, 'client/build');
  const indexPath = path.join(buildPath, 'index.html');
  
  // Check if build files exist
  const fs = require('fs');
  if (fs.existsSync(buildPath) && fs.existsSync(indexPath)) {
    app.use(express.static(buildPath));
    
    // Handle React routing, return all requests to React app
    app.get('*', (req, res) => {
      res.sendFile(indexPath);
    });
  } else {
    // Fallback if build files don't exist
    app.get('*', (req, res) => {
      res.json({ 
        error: 'Frontend build not found',
        message: 'Joy Dairy API Server is running, but frontend build is missing', 
        version: '1.0.0',
        endpoints: {
          auth: '/api/auth',
          entries: '/api/entries'
        },
        buildPath: buildPath,
        buildExists: fs.existsSync(buildPath)
      });
    });
  }
} else {
  app.get('/', (req, res) => {
    res.json({ 
      message: 'Joy Dairy API Server - Development Mode', 
      version: '1.0.0',
      endpoints: {
        auth: '/api/auth',
        entries: '/api/entries'
      }
    });
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
