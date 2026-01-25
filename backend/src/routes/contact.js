const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// POST /api/contact - Submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Insert contact message into database
    const query = `
      INSERT INTO contact_messages (name, email, subject, message, created_at)
      VALUES (?, ?, ?, ?, NOW())
    `;

    await pool.query(query, [name, email, subject, message]);

    // In a production environment, you would also send an email notification here
    // For now, we just store it in the database

    res.status(200).json({ 
      message: 'Contact message submitted successfully',
      success: true 
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Failed to submit contact message' });
  }
});

// GET /api/contact - Get all contact messages (Admin only)
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT id, name, email, subject, message, created_at, status
      FROM contact_messages
      ORDER BY created_at DESC
    `;

    const [messages] = await pool.query(query);
    res.json(messages);

  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({ error: 'Failed to fetch contact messages' });
  }
});

// PUT /api/contact/:id - Update contact message status (Admin only)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const query = `
      UPDATE contact_messages
      SET status = ?
      WHERE id = ?
    `;

    await pool.query(query, [status, id]);

    res.json({ message: 'Contact message status updated successfully' });

  } catch (error) {
    console.error('Error updating contact message:', error);
    res.status(500).json({ error: 'Failed to update contact message' });
  }
});

module.exports = router;
