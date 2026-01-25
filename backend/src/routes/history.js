const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Get user's reading history
router.get('/history/:userId', async (req, res) => {
  try {
    const [history] = await pool.query(
      `SELECT p.*, h.read_at 
       FROM reading_history h 
       JOIN posts p ON h.post_id = p.id 
       WHERE h.user_id = ? 
       ORDER BY h.read_at DESC
       LIMIT 50`,
      [req.params.userId]
    );
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reading history', details: error.message });
  }
});

// Add to reading history
router.post('/history', async (req, res) => {
  try {
    const { userId, postId } = req.body;

    await pool.query('DELETE FROM reading_history WHERE user_id = ? AND post_id = ?', [userId, postId]);
    await pool.query('INSERT INTO reading_history (user_id, post_id) VALUES (?, ?)', [userId, postId]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add to history', details: error.message });
  }
});

// Clear reading history
router.delete('/history/:userId', async (req, res) => {
  try {
    await pool.query('DELETE FROM reading_history WHERE user_id = ?', [req.params.userId]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear history', details: error.message });
  }
});

module.exports = router;
