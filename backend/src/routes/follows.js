const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Get user's following list
router.get('/following/:userId', async (req, res) => {
  try {
    const [following] = await pool.query(
      `SELECT u.id, u.username, u.avatar, u.bio, f.created_at as followed_at,
       (SELECT COUNT(*) FROM posts WHERE author_id = u.id AND published = TRUE) as story_count
       FROM follows f 
       JOIN users u ON f.following_id = u.id 
       WHERE f.follower_id = ? 
       ORDER BY f.created_at DESC`,
      [req.params.userId]
    );
    res.json(following);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch following list', details: error.message });
  }
});

// Get user's followers list
router.get('/followers/:userId', async (req, res) => {
  try {
    const [followers] = await pool.query(
      `SELECT u.id, u.username, u.avatar, u.bio, f.created_at as followed_at
       FROM follows f 
       JOIN users u ON f.follower_id = u.id 
       WHERE f.following_id = ? 
       ORDER BY f.created_at DESC`,
      [req.params.userId]
    );
    res.json(followers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch followers list', details: error.message });
  }
});

// Toggle follow
router.post('/follows', async (req, res) => {
  try {
    const { followerId, followingId } = req.body;

    if (followerId === followingId) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }

    const [existing] = await pool.query(
      'SELECT * FROM follows WHERE follower_id = ? AND following_id = ?',
      [followerId, followingId]
    );

    if (existing.length > 0) {
      await pool.query('DELETE FROM follows WHERE follower_id = ? AND following_id = ?', [followerId, followingId]);
      res.json({ following: false });
    } else {
      await pool.query('INSERT INTO follows (follower_id, following_id) VALUES (?, ?)', [followerId, followingId]);
      res.json({ following: true });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle follow', details: error.message });
  }
});

// Check if following
router.get('/follows/:followerId/:followingId', async (req, res) => {
  try {
    const [existing] = await pool.query(
      'SELECT * FROM follows WHERE follower_id = ? AND following_id = ?',
      [req.params.followerId, req.params.followingId]
    );
    res.json({ following: existing.length > 0 });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check follow status', details: error.message });
  }
});

module.exports = router;
