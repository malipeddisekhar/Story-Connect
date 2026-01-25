const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Toggle like
router.post('/posts/:postId/like', async (req, res) => {
  try {
    const { userId } = req.body;
    const postId = req.params.postId;

    const [existing] = await pool.query(
      'SELECT * FROM likes WHERE post_id = ? AND user_id = ?',
      [postId, userId]
    );

    if (existing.length > 0) {
      await pool.query('DELETE FROM likes WHERE post_id = ? AND user_id = ?', [postId, userId]);
      res.json({ liked: false });
    } else {
      await pool.query('INSERT INTO likes (post_id, user_id) VALUES (?, ?)', [postId, userId]);
      res.json({ liked: true });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle like', details: error.message });
  }
});

// Get like count
router.get('/posts/:postId/likes', async (req, res) => {
  try {
    const [[result]] = await pool.query(
      'SELECT COUNT(*) as count FROM likes WHERE post_id = ?',
      [req.params.postId]
    );
    res.json({ count: result.count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get likes', details: error.message });
  }
});

// Check if user liked a post
router.get('/posts/:postId/likes/:userId', async (req, res) => {
  try {
    const [existing] = await pool.query(
      'SELECT * FROM likes WHERE post_id = ? AND user_id = ?',
      [req.params.postId, req.params.userId]
    );
    res.json({ liked: existing.length > 0 });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check like status', details: error.message });
  }
});

module.exports = router;
