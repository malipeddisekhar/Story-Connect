# StoryConnect

A professional storytelling platform with role-based access, reader features, and MySQL database.

## Quick Start

### Prerequisites
- Node.js 18+
- MySQL Server

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   cd server && npm install
   ```

2. **Setup database:**
   ```bash
   mysql -u root -p < setup-database.sql
   ```

3. **Update MySQL password** in `server/index.js` (line 18)

4. **Start servers:**
   ```bash
   # Terminal 1 - Backend
   cd server && node index.js
   
   # Terminal 2 - Frontend
   npm run dev
   ```

5. Open http://localhost:3000

## Test Accounts
- **Admin:** admin@storyconnect.com / password123
- **Author:** jane@storyconnect.com / password123
- **Reader:** reader@storyconnect.com / password123

## Features
- 📚 Story reading & discovery
- ❤️ Like & bookmark stories
- 💬 Comments
- 👥 Follow authors
- ✍️ Story creation (Author/Admin)
- 🛠️ User management (Admin)
