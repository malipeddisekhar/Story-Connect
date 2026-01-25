const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const upload = require('../middleware/upload');

// Get all users
router.get('/', async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, username, email, role, avatar, bio, created_at FROM users ORDER BY created_at DESC');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users', details: error.message });
  }
});

// Upload avatar
router.post('/upload/avatar', upload.single('avatar'), async (req, res) => {
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

// Update user
router.put('/:id', async (req, res) => {
  try {
    const { username, bio, avatar } = req.body;

    await pool.query(
      'UPDATE users SET username = ?, bio = ?, avatar = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [username, bio, avatar, req.params.id]
    );

    const [users] = await pool.query('SELECT id, username, email, role, avatar, bio, created_at FROM users WHERE id = ?', [req.params.id]);
    res.json(users[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user', details: error.message });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user', details: error.message });
  }
});

// Get user by ID
router.get('/:userId', async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, username, email, role, avatar, bio, created_at FROM users WHERE id = ?', [req.params.userId]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(users[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user', details: error.message });
  }
});

// Get user stats
router.get('/:userId/stats', async (req, res) => {
  try {
    const [[followers]] = await pool.query('SELECT COUNT(*) as count FROM follows WHERE following_id = ?', [req.params.userId]);
    const [[following]] = await pool.query('SELECT COUNT(*) as count FROM follows WHERE follower_id = ?', [req.params.userId]);
    const [[posts]] = await pool.query('SELECT COUNT(*) as count FROM posts WHERE author_id = ? AND published = TRUE', [req.params.userId]);
    
    res.json({
      followers: followers.count,
      following: following.count,
      posts: posts.count
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user stats', details: error.message });
  }
});

module.exports = router;
