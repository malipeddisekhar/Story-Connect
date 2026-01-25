require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');
const commentRoutes = require('./routes/comments');
const likeRoutes = require('./routes/likes');
const bookmarkRoutes = require('./routes/bookmarks');
const historyRoutes = require('./routes/history');
const followRoutes = require('./routes/follows');
const searchRoutes = require('./routes/search');
const contactRoutes = require('./routes/contact');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parsing Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request Logging Middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Serve uploaded files statically
const uploadsDir = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsDir));

// Import upload middleware for avatar route
const upload = require('./middleware/upload');

// Health Check Route
app.get('/api/test', async (req, res) => {
  try {
    await pool.query('SELECT 1 as test');
    res.json({ message: 'Database connected successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed', details: error.message });
  }
});

// Avatar upload route (accessible at /api/upload/avatar)
app.post('/api/upload/avatar', upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const PORT = process.env.PORT || 5000;
    const avatarUrl = `http://localhost:${PORT}/uploads/avatars/${req.file.filename}`;
    res.json({ url: avatarUrl, filename: req.file.filename });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload avatar', details: error.message });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api', commentRoutes);
app.use('/api', likeRoutes);
app.use('/api', bookmarkRoutes);
app.use('/api', historyRoutes);
app.use('/api', followRoutes);
app.use('/api', searchRoutes);
app.use('/api/contact', contactRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// Start Server
app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════════════════╗
  ║                                                   ║
  ║   🚀 StoryConnect Backend Server Running!         ║
  ║                                                   ║
  ║   Local:    http://localhost:${PORT}               ║
  ║   API:      http://localhost:${PORT}/api           ║
  ║                                                   ║
  ║   Endpoints:                                      ║
  ║   • GET  /api/test         - Test connection      ║
  ║   • POST /api/auth/login   - Login                ║
  ║   • POST /api/auth/register- Register             ║
  ║   • GET  /api/posts        - Get all posts        ║
  ║   • GET  /api/users        - Get all users        ║
  ║                                                   ║
  ╚═══════════════════════════════════════════════════╝
  `);
});

module.exports = app;
