const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Get comments for a post
router.get('/posts/:postId/comments', async (req, res) => {
  try {
    const [comments] = await pool.query(
      `SELECT c.*, u.username, u.avatar 
       FROM comments c 
       JOIN users u ON c.user_id = u.id 
       WHERE c.post_id = ? 
       ORDER BY c.created_at DESC`,
      [req.params.postId]
    );
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comments', details: error.message });
  }
});

// Add comment
router.post('/posts/:postId/comments', async (req, res) => {
  try {
    const { userId, content } = req.body;

    const [result] = await pool.query(
      'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
      [req.params.postId, userId, content]
    );

    const [comments] = await pool.query(
      `SELECT c.*, u.username, u.avatar 
       FROM comments c 
       JOIN users u ON c.user_id = u.id 
       WHERE c.id = ?`,
      [result.insertId]
    );
    res.json(comments[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add comment', details: error.message });
  }
});

module.exports = router;
