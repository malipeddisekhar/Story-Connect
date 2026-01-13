-- StoryConnect Database Setup Script
-- Run this file: mysql -u root -p < setup-database.sql

-- Create database
CREATE DATABASE IF NOT EXISTS storyconnect;
USE storyconnect;

-- Drop existing tables (if any)
DROP TABLE IF EXISTS likes;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('READER', 'AUTHOR', 'ADMIN') DEFAULT 'READER',
    avatar VARCHAR(500),
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_username (username)
);

-- Create posts table
CREATE TABLE posts (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT,
    content LONGTEXT NOT NULL,
    author_id VARCHAR(50) NOT NULL,
    author_name VARCHAR(100) NOT NULL,
    category VARCHAR(100),
    cover_image VARCHAR(500),
    published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    read_time VARCHAR(20),
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_author (author_id),
    INDEX idx_published (published),
    INDEX idx_category (category)
);

-- Create comments table
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id VARCHAR(50) NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_post (post_id)
);

-- Create likes table
CREATE TABLE likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id VARCHAR(50) NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_like (post_id, user_id),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    post_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_bookmark (user_id, post_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

-- Create reading history table
CREATE TABLE IF NOT EXISTS reading_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    post_id VARCHAR(50) NOT NULL,
    read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

-- Create follows table
CREATE TABLE IF NOT EXISTS follows (
    id INT AUTO_INCREMENT PRIMARY KEY,
    follower_id VARCHAR(50) NOT NULL,
    following_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_follow (follower_id, following_id),
    FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert sample data
-- Note: Passwords are bcrypt hashed. Default password for all users is 'password123'
-- You can generate new hashes using: node -e "console.log(require('bcryptjs').hashSync('yourpassword', 10))"
INSERT INTO users (id, username, email, password, role, avatar, bio) VALUES
('u1', 'admin_master', 'admin@storyconnect.com', '$2a$10$efGbgIIe.MmCQpqBXwLPi.jXwJQZYWn9OzQll.L7sspR5KJSwLof.', 'ADMIN', 'https://picsum.photos/seed/admin/200', 'Platform Supervisor and Content Moderator.'),
('u2', 'jane_narrator', 'jane@storyconnect.com', '$2a$10$efGbgIIe.MmCQpqBXwLPi.jXwJQZYWn9OzQll.L7sspR5KJSwLof.', 'AUTHOR', 'https://picsum.photos/seed/jane/200', 'Storyteller, traveler, and professional dreamer.'),
('u3', 'reader1', 'reader@storyconnect.com', '$2a$10$efGbgIIe.MmCQpqBXwLPi.jXwJQZYWn9OzQll.L7sspR5KJSwLof.', 'READER', 'https://picsum.photos/seed/reader/200', 'Love reading stories!');

INSERT INTO posts (id, title, excerpt, content, author_id, author_name, category, cover_image, published, read_time) VALUES
('p1', 'The Future of Digital Narrative', 'How AI and humans are collaborating to build new worlds.', 'Storytelling has always been the fundamental unit of human connection. In the digital age, we see a fusion of technical precision and raw emotional depth. This platform is designed to facilitate that intersection, allowing every voice to resonate clearly in the noise of the 21st century.', 'u2', 'Jane Narrator', 'Technology', 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80', TRUE, '4 min'),
('p2', 'The Zen of Minimalist Design', 'Finding peace and clarity through reduction and intent.', 'In design, perfection is achieved not when there is nothing more to add, but when there is nothing left to take away. This philosophy applies equally to life and the digital interfaces we build. Clarity of purpose is the ultimate luxury in an over-stimulated world.', 'u1', 'Admin Master', 'Philosophy', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', TRUE, '3 min');

-- Show created tables
SELECT 'Database setup complete!' AS Status;
SHOW TABLES;
