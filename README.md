# 🌍 StoryConnect  
_A modern storytelling platform built with React, Express & MySQL_

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-blue.svg)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

🔗 **Live Demo:** https://storyconnect-frontend.onrender.com/#/  
📩 **Contact:** malipeddisekhar63@gmail.com  
📍 **Location:** Srikakulam District, Muddada village  
⏱️ **Support Response:** Within 24 hours

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Database Setup](#database-setup)
  - [Running the Application](#running-the-application)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🎯 Overview

**StoryConnect** is a full-stack web application that provides a platform for creative writers to share their stories and for readers to discover engaging content. The platform features role-based access control with three distinct user types: Readers, Authors, and Admins.

### Why StoryConnect?

- **For Readers:** Discover compelling stories, build reading lists, and engage with authors
- **For Authors:** Share your creativity, build an audience, and get AI-powered writing suggestions
- **For Admins:** Manage content, moderate users, and maintain platform quality
- **For Developers:** Clean architecture, well-documented code, and modern tech stack

### Key Highlights

✨ **Modern UI/UX** - Clean, responsive design with dark/light theme support  
🔐 **Secure Authentication** - JWT-based auth with bcrypt password hashing  
🤖 **AI-Powered** - Google Gemini AI integration for story enhancement  
📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile  
⚡ **Real-time Updates** - Dynamic content with instant feedback  
🎨 **Rich Editor** - Full-featured story editor with formatting options

---

## ✨ Features

### 🔐 Authentication & Authorization
- User registration with email validation
- Secure login with JWT tokens
- Role-based access control (ADMIN, AUTHOR, READER)
- Password encryption using bcrypt
- Protected routes and API endpoints

### 👤 User Management
- User profile customization
- Avatar upload and management
- Bio and personal information
- Account settings
- View user statistics (stories published, followers, etc.)

### ✍️ Story Creation & Management
- Rich text editor for story creation
- Category selection (Fiction, Mystery, Romance, Sci-Fi, etc.)
- Cover image support
- Draft and publish workflow
- Edit and delete published stories
- AI-powered writing suggestions (Gemini AI)
- Automatic read time calculation

### 📚 Reading Experience
- Browse all published stories
- Filter by category
- Search by title, author, or content
- View story details with author information
- Reading progress tracking
- Share stories

### 💬 Engagement Features
- Like/Unlike stories
- Comment on stories
- Bookmark favorite stories
- Follow/Unfollow authors
- View reading history
- Personalized recommendations

### 👥 Author Features
- Author profile page
- Published works showcase
- Follower count and management
- Story analytics (views, likes, comments)
- Author directory

### 🛠️ Admin Dashboard
- User management (view, edit, delete)
- Content moderation
- View contact form submissions
- Platform statistics
- Role assignment

### 🎨 UI/UX Features
- Dark/Light theme toggle
- Responsive design (mobile-first)
- Smooth animations and transitions
- Loading states and error handling
- Toast notifications
- Modal dialogs
- Infinite scroll support

### 📄 Additional Pages
- Contact form with email integration
- Privacy Policy
- Terms of Service
- FAQ section
- About the platform

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.3 | UI Framework |
| **React Router DOM** | 7.12.0 | Client-side routing |
| **Vite** | 6.2.0 | Build tool & dev server |
| **Google Gemini AI** | 1.35.0 | AI writing suggestions |
| **CSS3** | - | Styling (Tailwind-inspired inline) |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 16+ | Runtime environment |
| **Express.js** | 4.18.2 | Web framework |
| **MySQL2** | 3.16.1 | Database driver |
| **JWT** | 9.0.2 | Authentication tokens |
| **bcryptjs** | 2.4.3 | Password hashing |
| **Multer** | 1.4.5 | File uploads |
| **CORS** | 2.8.5 | Cross-origin requests |
| **dotenv** | 17.2.3 | Environment variables |

### Database
| Technology | Version | Purpose |
|------------|---------|---------|
| **MySQL** | 8.0+ | Relational database |

### Development Tools
- **nodemon** - Auto-restart server
- **ESLint** - Code linting
- **Git** - Version control

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MySQL** (v8.0 or higher) - [Download here](https://dev.mysql.com/downloads/)
- **npm** or **yarn** - Comes with Node.js
- **Git** - [Download here](https://git-scm.com/)

Check your installations:
```bash
node --version  # Should be v16 or higher
npm --version   # Should be 8 or higher
mysql --version # Should be 8.0 or higher
```

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/malipeddisekhar/storyconnect.git
cd storyconnect
```

#### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

This will install:
- express, cors, dotenv
- mysql2 (MySQL driver)
- jsonwebtoken, bcryptjs (authentication)
- multer (file uploads)

#### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

This will install:
- react, react-dom, react-router-dom
- @google/genai (AI integration)
- vite (build tool)

### Database Setup

#### Option 1: Using MySQL Command Line

1. **Start MySQL Server**
```bash
# Windows
net start MySQL80

# macOS/Linux
sudo systemctl start mysql
```

2. **Login to MySQL**
```bash
mysql -u root -p
# Enter your MySQL root password
```

3. **Create Database**
```sql
CREATE DATABASE storyconnect;
exit;
```

4. **Import Schema**
```bash
cd backend
mysql -u root -p storyconnect < setup-database.sql
# Enter your MySQL root password
```

#### Option 2: Using Node.js Script

```bash
cd backend
node init-database.js
```

This will:
- Create the `storyconnect` database
- Create all 8 tables (users, posts, comments, likes, bookmarks, reading_history, follows, contact_messages)
- Set up indexes and foreign keys

#### Verify Database Setup
```bash
mysql -u root -p
USE storyconnect;
SHOW TABLES;
# Should show 8 tables
exit;
```

### Environment Configuration

#### 1. Backend Environment Variables

Create `backend/.env` file:
```env
# MySQL Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=storyconnect
DB_PORT=3306

# JWT Secret (generate a random string)
JWT_SECRET=7e2b1c8f2a4d4e6b9c3f5a1e7d8b6c2f4a9e3b7c1d5f8a2e6c4b9d7f1a3e5c8b

# Optional: Gemini API Key for AI features
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Server Port
PORT=5000

# Optional: Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

**Generate a secure JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Get Gemini API Key (Optional):**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with Google account
3. Create API key
4. Copy and paste into `.env`

#### 2. Frontend Environment Variables

Create `frontend/.env` file:
```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api

# Optional: Gemini API Key (if you want client-side AI)
GEMINI_API_KEY=your_gemini_api_key_here
```

### Running the Application

#### Pre-flight Check (Recommended)

Before starting the server, run the automated validation:
```bash
cd backend
npm run check
```

This will verify:
- ✅ Dependencies installed
- ✅ Environment variables configured
- ✅ Database connection working
- ✅ Database schema complete
- ✅ Uploads directory exists
- ✅ Port availability

#### Start Backend Server

**Terminal 1:**
```bash
cd backend
npm start
```

You should see:
```
✅ MySQL Database connected successfully
╔═══════════════════════════════════════════════════╗
║   🚀 StoryConnect Backend Server Running!         ║
║   Local:    http://localhost:5000                 ║
║   API:      http://localhost:5000/api             ║
╚═══════════════════════════════════════════════════╝
```

**Test the API:**
Open browser and go to: `http://localhost:5000/api/test`  
You should see: `{"message":"Database connected successfully!"}`

#### Start Frontend Development Server

**Terminal 2:**
```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v6.2.0  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

#### Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

You should see the StoryConnect home page! 🎉

### First Time Setup

1. **Create Your First Account**
   - Click "Sign Up" or "Get Started"
   - Choose role: READER or AUTHOR
   - Fill in username, email, and password
   - Click "Sign Up"

2. **Explore as Reader**
   - Browse stories on home page
   - Click on any story to read
   - Like, comment, bookmark stories
   - View author profiles

3. **Publish as Author**
   - Sign up with AUTHOR role
   - Click "Write" in navigation
   - Create your first story
   - Add title, content, category
   - Click "Publish"

4. **Admin Access** (Optional)
   - Admin accounts must be created directly in database
   - Or modify an existing user's role to 'ADMIN'

---

## 📁 Project Structure

```
storyconnect/
│
├── backend/                          # Node.js Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js           # MySQL connection pool
│   │   ├── middleware/
│   │   │   ├── auth.js               # JWT authentication middleware
│   │   │   └── upload.js             # Multer file upload config
│   │   ├── routes/
│   │   │   ├── auth.js               # Login, register, current user
│   │   │   ├── posts.js              # CRUD for stories
│   │   │   ├── users.js              # User management
│   │   │   ├── comments.js           # Comment operations
│   │   │   ├── likes.js              # Like/unlike stories
│   │   │   ├── bookmarks.js          # Bookmark management
│   │   │   ├── history.js            # Reading history
│   │   │   ├── follows.js            # Follow/unfollow authors
│   │   │   ├── search.js             # Search & filters
│   │   │   └── contact.js            # Contact form submissions
│   │   └── server.js                 # Express app configuration
│   ├── uploads/
│   │   └── avatars/                  # User avatar uploads
│   ├── .env                          # Environment variables (not in git)
│   ├── .env.example                  # Environment template
│   ├── index.js                      # Server entry point
│   ├── setup-database.sql            # MySQL schema
│   ├── init-database.js              # Database setup script
│   ├── preflight-check.js            # Pre-start validation
│   └── package.json                  # Backend dependencies
│
├── frontend/                         # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout.jsx            # Main layout with header/footer
│   │   ├── pages/
│   │   │   ├── Home.jsx              # Landing page
│   │   │   ├── Auth.jsx              # Login/Register page
│   │   │   ├── Profile.jsx           # User profile page
│   │   │   ├── StoryView.jsx         # Read story page
│   │   │   ├── StoryEditor.jsx       # Create/Edit story
│   │   │   ├── Explore.jsx           # Browse stories
│   │   │   ├── Authors.jsx           # Author directory
│   │   │   ├── AuthorProfile.jsx     # Author profile page
│   │   │   ├── ReaderDashboard.jsx   # Reader dashboard
│   │   │   ├── AdminDashboard.jsx    # Admin panel
│   │   │   ├── Contact.jsx           # Contact form
│   │   │   ├── PrivacyPolicy.jsx     # Privacy policy
│   │   │   └── TermsOfService.jsx    # Terms of service
│   │   ├── services/
│   │   │   ├── authService.js        # Auth API calls
│   │   │   ├── postService.js        # Post API calls
│   │   │   ├── readerService.js      # Reader API calls
│   │   │   ├── geminiService.js      # Gemini AI integration
│   │   │   └── mockDb.js             # Mock data utilities
│   │   ├── App.jsx                   # Main app component
│   │   ├── index.tsx                 # React entry point
│   │   ├── types.ts                  # TypeScript types
│   │   └── index.css                 # Global styles
│   ├── dist/                         # Production build output
│   ├── .env                          # Environment variables (not in git)
│   ├── .env.example                  # Environment template
│   ├── index.html                    # HTML template
│   ├── vite.config.js                # Vite configuration
│   └── package.json                  # Frontend dependencies
│
├── .gitignore                        # Git ignore file
├── README.md                         # This file
├── DEPLOYMENT.md                     # Deployment guide
├── CODE_REVIEW.md                    # Code review summary
└── QUICKSTART.md                     # Quick start guide
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "role": "AUTHOR" // or "READER"
}

Response: 200 OK
{
  "user": { "id": "...", "username": "johndoe", ... },
  "token": "jwt_token_here"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "user": { "id": "...", "username": "johndoe", ... },
  "token": "jwt_token_here"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>

Response: 200 OK
{
  "id": "...",
  "username": "johndoe",
  "email": "john@example.com",
  "role": "AUTHOR",
  ...
}
```

### Post (Story) Endpoints

#### Get All Posts
```http
GET /api/posts?category=Fiction&limit=10

Response: 200 OK
[
  {
    "id": "post-1",
    "title": "My Story",
    "excerpt": "Story description",
    "author_name": "John Doe",
    "category": "Fiction",
    "likes_count": 10,
    "comments_count": 5,
    ...
  }
]
```

#### Get Single Post
```http
GET /api/posts/:id

Response: 200 OK
{
  "id": "post-1",
  "title": "My Story",
  "content": "Full story content here...",
  "author_id": "user-1",
  "author_name": "John Doe",
  ...
}
```

#### Create Post (Auth Required)
```http
POST /api/posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My New Story",
  "excerpt": "A brief description",
  "content": "Full story content",
  "category": "Fiction",
  "published": true
}

Response: 201 Created
{
  "id": "new-post-id",
  "title": "My New Story",
  ...
}
```

#### Update Post (Auth Required)
```http
PUT /api/posts/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content",
  ...
}

Response: 200 OK
{ "message": "Post updated successfully" }
```

#### Delete Post (Auth Required)
```http
DELETE /api/posts/:id
Authorization: Bearer <token>

Response: 200 OK
{ "message": "Post deleted successfully" }
```

### Engagement Endpoints

#### Like Post
```http
POST /api/posts/:id/like
Authorization: Bearer <token>

Response: 200 OK
{ "message": "Post liked successfully" }
```

#### Comment on Post
```http
POST /api/posts/:id/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Great story!"
}

Response: 201 Created
{
  "id": 1,
  "content": "Great story!",
  "user_id": "...",
  "created_at": "..."
}
```

#### Bookmark Post
```http
POST /api/bookmarks
Authorization: Bearer <token>
Content-Type: application/json

{
  "postId": "post-1"
}

Response: 201 Created
{ "message": "Bookmark added" }
```

For complete API documentation, see the route files in `backend/src/routes/`

---

## 🔐 Environment Variables

### Backend (.env)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DB_HOST` | Yes | localhost | MySQL host address |
| `DB_USER` | Yes | root | MySQL username |
| `DB_PASSWORD` | Yes | - | MySQL password |
| `DB_NAME` | Yes | storyconnect | Database name |
| `DB_PORT` | No | 3306 | MySQL port |
| `JWT_SECRET` | Yes | - | Secret key for JWT tokens |
| `PORT` | No | 5000 | Backend server port |
| `FRONTEND_URL` | No | * | Frontend URL for CORS |
| `GEMINI_API_KEY` | No | - | Google Gemini AI API key |

### Frontend (.env)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_URL` | Yes | - | Backend API base URL |
| `GEMINI_API_KEY` | No | - | Google Gemini AI API key |

---

## 🌐 Deployment

StoryConnect can be deployed to various cloud platforms. See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

### Quick Deploy Options

**Backend:**
- ✅ [Render](https://render.com) (Recommended - Free tier available)
- ✅ [Railway](https://railway.app) (Simple setup)
- ✅ [Heroku](https://heroku.com) (Paid plans)

**Frontend:**
- ✅ [Vercel](https://vercel.com) (Recommended - Fast CDN)
- ✅ [Netlify](https://netlify.com) (Easy deployment)
- ✅ [Render Static](https://render.com) (Same platform as backend)

**Database:**
- ✅ [PlanetScale](https://planetscale.com) (MySQL - Free tier)
- ✅ [Railway MySQL](https://railway.app) (Included with backend)
- ✅ [AWS RDS](https://aws.amazon.com/rds/) (Production-grade)

### Deployment Checklist

- [ ] Push code to GitHub
- [ ] Create production database
- [ ] Configure environment variables
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Update API URLs
- [ ] Test all features
- [ ] Set up custom domain (optional)

---

## 📸 Screenshots

### Home Page
![Home Page](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Home+Page+Screenshot)

### Story Reader
![Story View](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Story+Reader+Screenshot)

### Story Editor
![Story Editor](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Story+Editor+Screenshot)

### User Dashboard
![Dashboard](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Dashboard+Screenshot)

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Reporting Bugs
1. Check existing issues first
2. Create detailed bug report with:
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details

### Suggesting Features
1. Open an issue with `[FEATURE]` prefix
2. Describe the feature and use case
3. Explain why it would be valuable

### Submitting Pull Requests
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Test thoroughly
5. Commit with clear messages (`git commit -m 'Add some AmazingFeature'`)
6. Push to your branch (`git push origin feature/AmazingFeature`)
7. Open a Pull Request

### Development Guidelines
- Follow existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes
- Update documentation if needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2026 Malipeddi Sekhar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📞 Contact

**Developer:** Malipeddi Sekhar

- 📧 **Email:** malipeddisekhar63@gmail.com
- 📍 **Location:** Srikakulam District, Muddada village
- 💼 **GitHub:** [@malipeddisekhar](https://github.com/malipeddisekhar)
- 💼 **LinkedIn:** [Malipeddi Sekhar](https://linkedin.com/in/malipeddisekhar)
- ⏱️ **Response Time:** Within 24 hours

### Support

For support and questions:
- 📧 Email: malipeddisekhar63@gmail.com
- 📝 Use the [Contact Form](https://storyconnect-frontend.onrender.com/#/contact) on the website
- 🐛 Report bugs via [GitHub Issues](https://github.com/malipeddisekhar/storyconnect/issues)

---

## 🙏 Acknowledgments

- React team for the amazing framework
- Express.js community
- MySQL developers
- Google for Gemini AI
- All open-source contributors
- Stack Overflow community

---

## 🌟 Star History

If you find this project helpful, please consider giving it a ⭐!

---

## 📚 Additional Resources

- [QUICKSTART.md](QUICKSTART.md) - Quick start guide
- [DEPLOYMENT.md](DEPLOYMENT.md) - Detailed deployment instructions
- [CODE_REVIEW.md](CODE_REVIEW.md) - Code review and quality checks

---

## 🔄 Version History

### v1.0.0 (January 2026)
- ✅ Initial release
- ✅ User authentication system
- ✅ Story CRUD operations
- ✅ Reader dashboard
- ✅ Author profiles
- ✅ Admin panel
- ✅ AI writing suggestions
- ✅ Dark mode support
- ✅ Contact form
- ✅ Fully responsive design

---

## 🎯 Future Roadmap

### Short Term (Next 3 months)
- [ ] Cover image upload for stories
- [ ] Email notifications
- [ ] Password reset functionality
- [ ] Social media sharing
- [ ] Story categories expansion
- [ ] Advanced search filters

### Medium Term (3-6 months)
- [ ] Real-time notifications
- [ ] Story drafts auto-save
- [ ] Reading progress bar
- [ ] User badges and achievements
- [ ] Analytics dashboard for authors
- [ ] Mobile app (React Native)

### Long Term (6+ months)
- [ ] Multi-language support
- [ ] Audio narration (text-to-speech)
- [ ] Story collaboration features
- [ ] Monetization for authors
- [ ] API for third-party integrations
- [ ] Advanced AI features

---

**Built with ❤️ by Malipeddi Sekhar**

**© 2026 StoryConnect. All rights reserved.**
