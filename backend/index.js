const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'storyconnect_secret_key_2026';

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
const avatarsDir = path.join(uploadsDir, 'avatars');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, avatarsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

// PostgreSQL Connection Pool - Use environment variables for production
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'storyconnect',
  port: process.env.DB_PORT || 5432,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test database connection
app.get('/api/test', async (req, res) => {
  try {
    const result = await pool.query('SELECT 1 as test');
    res.json({ message: 'Database connected successfully!', data: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed', details: error.message });
  }
});

// ==================== AUTH ROUTES ====================

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    
    // Check if user exists
    const existing = (await pool.query('SELECT * FROM users WHERE email = $1', [email])).rows;
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate user ID
    const id = 'u' + Date.now();
    const avatar = `https://picsum.photos/seed/${username}/200`;

    // Insert user
    await pool.query(
      'INSERT INTO users (id, username, email, password, role, avatar) VALUES ($1, $2, $3, $4, $5, $6)',
      [id, username, email, hashedPassword, role || 'READER', avatar]
    );

    // Get created user
    const users = (await pool.query('SELECT id, username, email, role, avatar, bio, created_at FROM users WHERE id = $1', [id])).rows;
    const user = users[0];

    // Generate token
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ user, token });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const users = (await pool.query('SELECT * FROM users WHERE email = $1', [email])).rows;
    if (users.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    const user = users[0];

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate token
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

// Get current user
app.get('/api/auth/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const users = (await pool.query('SELECT id, username, email, role, avatar, bio, created_at FROM users WHERE id = $1', [decoded.id])).rows;
    
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: users[0] });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// ==================== POSTS ROUTES ====================

// Get all posts
app.get('/api/posts', async (req, res) => {
  try {
    const posts = (await pool.query(
      'SELECT * FROM posts WHERE published = TRUE ORDER BY created_at DESC'
    )).rows;
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts', details: error.message });
  }
});

// Get single post
app.get('/api/posts/:id', async (req, res) => {
  try {
    const posts = (await pool.query('SELECT * FROM posts WHERE id = $1', [req.params.id])).rows;
    if (posts.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(posts[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch post', details: error.message });
  }
});

// Create post
app.post('/api/posts', async (req, res) => {
  try {
    const { title, excerpt, content, authorId, authorName, category, coverImage, published, readTime } = req.body;
    const id = 'p' + Date.now();

    await pool.query(
      'INSERT INTO posts (id, title, excerpt, content, author_id, author_name, category, cover_image, published, read_time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
      [id, title, excerpt, content, authorId, authorName, category, coverImage, published, readTime]
    );

    const posts = (await pool.query('SELECT * FROM posts WHERE id = $1', [id])).rows;
    res.json(posts[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post', details: error.message });
  }
});

// Update post
app.put('/api/posts/:id', async (req, res) => {
  try {
    const { title, excerpt, content, category, coverImage, published, readTime } = req.body;

    await pool.query(
      'UPDATE posts SET title = $1, excerpt = $2, content = $3, category = $4, cover_image = $5, published = $6, read_time = $7, updated_at = CURRENT_TIMESTAMP WHERE id = $8',
      [title, excerpt, content, category, coverImage, published, readTime, req.params.id]
    );

    const posts = (await pool.query('SELECT * FROM posts WHERE id = $1', [req.params.id])).rows;
    res.json(posts[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update post', details: error.message });
  }
});

// Delete post
app.delete('/api/posts/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM posts WHERE id = $1', [req.params.id]);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post', details: error.message });
  }
});

// Get posts by author
app.get('/api/posts/author/:authorId', async (req, res) => {
  try {
    const posts = (await pool.query(
      'SELECT * FROM posts WHERE author_id = $1 ORDER BY created_at DESC',
      [req.params.authorId]
    )).rows;
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts', details: error.message });
  }
});

// ==================== USERS ROUTES ====================

// Get all users (admin)
app.get('/api/users', async (req, res) => {
  try {
    const users = (await pool.query('SELECT id, username, email, role, avatar, bio, created_at FROM users ORDER BY created_at DESC')).rows;
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users', details: error.message });
  }
});

// Upload avatar image
app.post('/api/upload/avatar', upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Return the URL to access the uploaded file
    const avatarUrl = `http://localhost:${PORT}/uploads/avatars/${req.file.filename}`;
    res.json({ url: avatarUrl, filename: req.file.filename });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload avatar', details: error.message });
  }
});

// Update user
app.put('/api/users/:id', async (req, res) => {
  try {
    const { username, bio, avatar } = req.body;

    await pool.query(
      'UPDATE users SET username = $1, bio = $2, avatar = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4',
      [username, bio, avatar, req.params.id]
    );

    const users = (await pool.query('SELECT id, username, email, role, avatar, bio, created_at FROM users WHERE id = $1', [req.params.id])).rows;
    res.json(users[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user', details: error.message });
  }
});

// Delete user (admin)
app.delete('/api/users/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user', details: error.message });
  }
});

// ==================== COMMENTS ROUTES ====================

// Get comments for a post
app.get('/api/posts/:postId/comments', async (req, res) => {
  try {
    const comments = (await pool.query(
      `SELECT c.*, u.username, u.avatar 
       FROM comments c 
       JOIN users u ON c.user_id = u.id 
       WHERE c.post_id = $1 
       ORDER BY c.created_at DESC`,
      [req.params.postId]
    )).rows;
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comments', details: error.message });
  }
});

// Add comment
app.post('/api/posts/:postId/comments', async (req, res) => {
  try {
    const { userId, content } = req.body;

    const result = (await pool.query(
      'INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING id',
      [req.params.postId, userId, content]
    )).rows;

    const comments = (await pool.query(
      `SELECT c.*, u.username, u.avatar 
       FROM comments c 
       JOIN users u ON c.user_id = u.id 
       WHERE c.id = ?`,
      [result[0].id]
    )).rows;
    res.json(comments[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add comment', details: error.message });
  }
});

// ==================== LIKES ROUTES ====================

// Toggle like
app.post('/api/posts/:postId/like', async (req, res) => {
  try {
    const { userId } = req.body;
    const postId = req.params.postId;

    // Check if already liked
    const existing = (await pool.query(
      'SELECT * FROM likes WHERE post_id = $1 AND user_id = $2',
      [postId, userId]
    )).rows;

    if (existing.length > 0) {
      // Unlike
      await pool.query('DELETE FROM likes WHERE post_id = $1 AND user_id = $2', [postId, userId]);
      res.json({ liked: false });
    } else {
      // Like
      await pool.query('INSERT INTO likes (post_id, user_id) VALUES ($1, $2)', [postId, userId]);
      res.json({ liked: true });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle like', details: error.message });
  }
});

// Get like count
app.get('/api/posts/:postId/likes', async (req, res) => {
  try {
    const result = (await pool.query(
      'SELECT COUNT(*) as count FROM likes WHERE post_id = $1',
      [req.params.postId]
    )).rows;
    res.json({ count: result[0].count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get likes', details: error.message });
  }
});

// Check if user liked a post
app.get('/api/posts/:postId/likes/:userId', async (req, res) => {
  try {
    const existing = (await pool.query(
      'SELECT * FROM likes WHERE post_id = $1 AND user_id = $2',
      [req.params.postId, req.params.userId]
    )).rows;
    res.json({ liked: existing.length > 0 });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check like status', details: error.message });
  }
});

// ==================== BOOKMARKS ROUTES ====================

// Get user's bookmarks
app.get('/api/bookmarks/:userId', async (req, res) => {
  try {
    const bookmarks = (await pool.query(
      `SELECT p.*, b.created_at as bookmarked_at 
       FROM bookmarks b 
       JOIN posts p ON b.post_id = p.id 
       WHERE b.user_id = $1 
       ORDER BY b.created_at DESC`,
      [req.params.userId]
    )).rows;
    res.json(bookmarks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookmarks', details: error.message });
  }
});

// Toggle bookmark
app.post('/api/bookmarks', async (req, res) => {
  try {
    const { userId, postId } = req.body;

    const existing = (await pool.query(
      'SELECT * FROM bookmarks WHERE user_id = $1 AND post_id = $2',
      [userId, postId]
    )).rows;

    if (existing.length > 0) {
      await pool.query('DELETE FROM bookmarks WHERE user_id = $1 AND post_id = $2', [userId, postId]);
      res.json({ bookmarked: false });
    } else {
      await pool.query('INSERT INTO bookmarks (user_id, post_id) VALUES ($1, $2)', [userId, postId]);
      res.json({ bookmarked: true });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle bookmark', details: error.message });
  }
});

// Check if bookmarked
app.get('/api/bookmarks/:userId/:postId', async (req, res) => {
  try {
    const existing = (await pool.query(
      'SELECT * FROM bookmarks WHERE user_id = $1 AND post_id = $2',
      [req.params.userId, req.params.postId]
    )).rows;
    res.json({ bookmarked: existing.length > 0 });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check bookmark status', details: error.message });
  }
});

// ==================== READING HISTORY ROUTES ====================

// Get user's reading history
app.get('/api/history/:userId', async (req, res) => {
  try {
    const history = (await pool.query(
      `SELECT p.*, h.read_at 
       FROM reading_history h 
       JOIN posts p ON h.post_id = p.id 
       WHERE h.user_id = $1 
       ORDER BY h.read_at DESC
       LIMIT 50`,
      [req.params.userId]
    )).rows;
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reading history', details: error.message });
  }
});

// Add to reading history
app.post('/api/history', async (req, res) => {
  try {
    const { userId, postId } = req.body;

    // Remove old entry if exists
    await pool.query('DELETE FROM reading_history WHERE user_id = $1 AND post_id = $2', [userId, postId]);
    
    // Add new entry
    await pool.query('INSERT INTO reading_history (user_id, post_id) VALUES ($1, $2)', [userId, postId]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add to history', details: error.message });
  }
});

// Clear reading history
app.delete('/api/history/:userId', async (req, res) => {
  try {
    await pool.query('DELETE FROM reading_history WHERE user_id = $1', [req.params.userId]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear history', details: error.message });
  }
});

// ==================== FOLLOWS ROUTES ====================

// Get user's following list
app.get('/api/following/:userId', async (req, res) => {
  try {
    const following = (await pool.query(
      `SELECT u.id, u.username, u.avatar, u.bio, f.created_at as followed_at,
       (SELECT COUNT(*) FROM posts WHERE author_id = u.id AND published = TRUE) as story_count
       FROM follows f 
       JOIN users u ON f.following_id = u.id 
       WHERE f.follower_id = $1 
       ORDER BY f.created_at DESC`,
      [req.params.userId]
    )).rows;
    res.json(following);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch following list', details: error.message });
  }
});

// Get user's followers list
app.get('/api/followers/:userId', async (req, res) => {
  try {
    const followers = (await pool.query(
      `SELECT u.id, u.username, u.avatar, u.bio, f.created_at as followed_at
       FROM follows f 
       JOIN users u ON f.follower_id = u.id 
       WHERE f.following_id = $1 
       ORDER BY f.created_at DESC`,
      [req.params.userId]
    )).rows;
    res.json(followers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch followers list', details: error.message });
  }
});

// Toggle follow
app.post('/api/follows', async (req, res) => {
  try {
    const { followerId, followingId } = req.body;

    if (followerId === followingId) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }

    const existing = (await pool.query(
      'SELECT * FROM follows WHERE follower_id = $1 AND following_id = $2',
      [followerId, followingId]
    )).rows;

    if (existing.length > 0) {
      await pool.query('DELETE FROM follows WHERE follower_id = $1 AND following_id = $2', [followerId, followingId]);
      res.json({ following: false });
    } else {
      await pool.query('INSERT INTO follows (follower_id, following_id) VALUES ($1, $2)', [followerId, followingId]);
      res.json({ following: true });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle follow', details: error.message });
  }
});

// Check if following
app.get('/api/follows/:followerId/:followingId', async (req, res) => {
  try {
    const existing = (await pool.query(
      'SELECT * FROM follows WHERE follower_id = $1 AND following_id = $2',
      [req.params.followerId, req.params.followingId]
    )).rows;
    res.json({ following: existing.length > 0 });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check follow status', details: error.message });
  }
});

// Get follower/following counts
app.get('/api/users/:userId/stats', async (req, res) => {
  try {
    const followers = (await pool.query('SELECT COUNT(*) as count FROM follows WHERE following_id = $1', [req.params.userId])).rows;
    const following = (await pool.query('SELECT COUNT(*) as count FROM follows WHERE follower_id = $1', [req.params.userId])).rows;
    const posts = (await pool.query('SELECT COUNT(*) as count FROM posts WHERE author_id = $1 AND published = TRUE', [req.params.userId])).rows;
    const likes = (await pool.query(
      `SELECT COUNT(*) as count FROM likes l 
       JOIN posts p ON l.post_id = p.id 
       WHERE p.author_id = ?`, 
      [req.params.userId]
    )).rows;
    
    res.json({
      followers: followers[0].count,
      following: following[0].count,
      posts: posts[0].count,
      totalLikes: likes[0].count
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user stats', details: error.message });
  }
});

// ==================== SEARCH ROUTES ====================

// Search posts
app.get('/api/search', async (req, res) => {
  try {
    const { q, category } = req.query;
    let query = 'SELECT * FROM posts WHERE published = TRUE';
    const params = [];

    if (q) {
      query += ' AND (title LIKE $1 OR content LIKE $2 OR author_name LIKE $3)';
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }

    if (category && category !== 'All') {
      query += ' AND category = $1';
      params.push(category);
    }

    query += ' ORDER BY created_at DESC';

    const posts = (await pool.query(query, params)).rows;
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search posts', details: error.message });
  }
});

// Get all categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = (await pool.query('SELECT DISTINCT category FROM posts WHERE published = TRUE')).rows;
    res.json(categories.map(c => c.category));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories', details: error.message });
  }
});

// Get posts from followed authors
app.get('/api/feed/:userId', async (req, res) => {
  try {
    const posts = (await pool.query(
      `SELECT p.* FROM posts p 
       JOIN follows f ON p.author_id = f.following_id 
       WHERE f.follower_id = $1 AND p.published = TRUE
       ORDER BY p.created_at DESC`,
      [req.params.userId]
    )).rows;
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch feed', details: error.message });
  }
});

// Get all authors (users who have posts)
app.get('/api/authors', async (req, res) => {
  try {
    const authors = (await pool.query(
      `SELECT u.id, u.username, u.avatar, u.bio, u.role,
       (SELECT COUNT(*) FROM posts WHERE author_id = u.id AND published = TRUE) as story_count,
       (SELECT COUNT(*) FROM follows WHERE following_id = u.id) as follower_count
       FROM users u 
       WHERE u.role IN ('AUTHOR', 'ADMIN')
       ORDER BY follower_count DESC`
    )).rows;
    res.json(authors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch authors', details: error.message });
  }
});

// Start server
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
