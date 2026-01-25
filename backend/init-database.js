// Database initialization script for StoryConnect
require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

async function initDatabase() {
  let connection;
  try {
    // Connect to MySQL without specifying a database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
      port: process.env.DB_PORT || 3306
    });

    console.log('✅ Connected to MySQL server');

    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'storyconnect'}`);
    console.log(`✅ Database '${process.env.DB_NAME || 'storyconnect'}' created/verified`);

    // Use the database
    await connection.query(`USE ${process.env.DB_NAME || 'storyconnect'}`);

    // Read and execute SQL file
    const sqlFile = await fs.readFile(path.join(__dirname, 'setup-database.sql'), 'utf-8');
    
    // Split SQL statements and execute them
    const statements = sqlFile
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('/*'));

    for (const statement of statements) {
      if (statement.toLowerCase().includes('create database') || 
          statement.toLowerCase().includes('use storyconnect') ||
          statement.toLowerCase().includes('select \'database setup complete')) {
        continue; // Skip these as we handle them differently
      }
      try {
        await connection.query(statement);
      } catch (err) {
        if (!err.message.includes('already exists')) {
          console.error('Error executing statement:', statement.substring(0, 50) + '...');
          console.error(err.message);
        }
      }
    }

    console.log('✅ All tables created successfully');
    console.log('✅ Database setup complete!');

  } catch (error) {
    console.error('❌ Database setup error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

initDatabase();
