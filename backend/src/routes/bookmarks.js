const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Get user's bookmarks
router.get('/bookmarks/:userId', async (req, res) => {
  try {
    const [bookmarks] = await pool.query(
      `SELECT p.*, b.created_at as bookmarked_at 
       FROM bookmarks b 
       JOIN posts p ON b.post_id = p.id 
       WHERE b.user_id = ? 
       ORDER BY b.created_at DESC`,
      [req.params.userId]
    );
    res.json(bookmarks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookmarks', details: error.message });
  }
});

// Toggle bookmark
router.post('/bookmarks', async (req, res) => {
  try {
    const { userId, postId } = req.body;

    const [existing] = await pool.query(
      'SELECT * FROM bookmarks WHERE user_id = ? AND post_id = ?',
      [userId, postId]
    );

    if (existing.length > 0) {
      await pool.query('DELETE FROM bookmarks WHERE user_id = ? AND post_id = ?', [userId, postId]);
      res.json({ bookmarked: false });
    } else {
      await pool.query('INSERT INTO bookmarks (user_id, post_id) VALUES (?, ?)', [userId, postId]);
      res.json({ bookmarked: true });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle bookmark', details: error.message });
  }
});

// Check if bookmarked
router.get('/bookmarks/:userId/:postId', async (req, res) => {
  try {
    const [existing] = await pool.query(
      'SELECT * FROM bookmarks WHERE user_id = ? AND post_id = ?',
      [req.params.userId, req.params.postId]
    );
    res.json({ bookmarked: existing.length > 0 });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check bookmark status', details: error.message });
  }
});

module.exports = router;
