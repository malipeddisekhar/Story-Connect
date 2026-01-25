const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Search posts
router.get('/search', async (req, res) => {
  try {
    const { q, category } = req.query;
    let query = 'SELECT * FROM posts WHERE published = TRUE';
    const params = [];

    if (q) {
      query += ' AND (title LIKE ? OR content LIKE ? OR author_name LIKE ?)';
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }

    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY created_at DESC';

    const [posts] = await pool.query(query, params);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search posts', details: error.message });
  }
});

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const [categories] = await pool.query('SELECT DISTINCT category FROM posts WHERE published = TRUE');
    res.json(categories.map(c => c.category));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories', details: error.message });
  }
});

// Get posts from followed authors
router.get('/feed/:userId', async (req, res) => {
  try {
    const [posts] = await pool.query(
      `SELECT p.* FROM posts p 
       JOIN follows f ON p.author_id = f.following_id 
       WHERE f.follower_id = ? AND p.published = TRUE
       ORDER BY p.created_at DESC`,
      [req.params.userId]
    );
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch feed', details: error.message });
  }
});

// Get all authors
router.get('/authors', async (req, res) => {
  try {
    const [authors] = await pool.query(
      `SELECT u.id, u.username, u.avatar, u.bio, u.role,
       (SELECT COUNT(*) FROM posts WHERE author_id = u.id AND published = TRUE) as story_count,
       (SELECT COUNT(*) FROM follows WHERE following_id = u.id) as follower_count
       FROM users u 
       WHERE u.role IN ('AUTHOR', 'ADMIN')
       ORDER BY follower_count DESC`
    );
    res.json(authors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch authors', details: error.message });
  }
});

module.exports = router;
