const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Get all posts
router.get('/', async (req, res) => {
  try {
    const [posts] = await pool.query(
      'SELECT * FROM posts WHERE published = TRUE ORDER BY created_at DESC'
    );
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts', details: error.message });
  }
});

// Get posts by author (MUST be before /:id route)
router.get('/author/:authorId', async (req, res) => {
  try {
    const [posts] = await pool.query(
      'SELECT * FROM posts WHERE author_id = ? ORDER BY created_at DESC',
      [req.params.authorId]
    );
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts', details: error.message });
  }
});

// Get single post
router.get('/:id', async (req, res) => {
  try {
    const [posts] = await pool.query('SELECT * FROM posts WHERE id = ?', [req.params.id]);
    if (posts.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(posts[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch post', details: error.message });
  }
});

// Create post
router.post('/', async (req, res) => {
  try {
    const { title, excerpt, content, authorId, authorName, category, coverImage, published, readTime } = req.body;
    const id = 'p' + Date.now();

    await pool.query(
      'INSERT INTO posts (id, title, excerpt, content, author_id, author_name, category, cover_image, published, read_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, title, excerpt, content, authorId, authorName, category, coverImage, published, readTime]
    );

    const [posts] = await pool.query('SELECT * FROM posts WHERE id = ?', [id]);
    res.json(posts[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post', details: error.message });
  }
});

// Update post
router.put('/:id', async (req, res) => {
  try {
    const { title, excerpt, content, category, coverImage, published, readTime } = req.body;

    await pool.query(
      'UPDATE posts SET title = ?, excerpt = ?, content = ?, category = ?, cover_image = ?, published = ?, read_time = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [title, excerpt, content, category, coverImage, published, readTime, req.params.id]
    );

    const [posts] = await pool.query('SELECT * FROM posts WHERE id = ?', [req.params.id]);
    res.json(posts[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update post', details: error.message });
  }
});

// Delete post
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM posts WHERE id = ?', [req.params.id]);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post', details: error.message });
  }
});

module.exports = router;
