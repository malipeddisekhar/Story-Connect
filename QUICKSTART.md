# 🚀 Quick Start Guide - StoryConnect

## For Local Development

### Prerequisites
- Node.js (v16+)
- MySQL (v8.0+)
- npm

### 1️⃣ Setup Database (One-time)
```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE storyconnect;
exit;

# Import schema
cd backend
mysql -u root -proot storyconnect < setup-database.sql
```

### 2️⃣ Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend (new terminal)
cd frontend
npm install
```

### 3️⃣ Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
Server runs on: `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
App runs on: `http://localhost:3000`

### 4️⃣ Open Browser
Navigate to: `http://localhost:3000`

---

## For Online Deployment

See `DEPLOYMENT.md` for complete guide.

**Quick Deploy to Render:**
1. Push code to GitHub
2. Create Render account
3. New Web Service → Connect GitHub
4. Add environment variables
5. Deploy!

---

## 📞 Need Help?

Email: malipeddisekhar63@gmail.com  
Response: Within 24 hours

---

## ✅ Verification

Run preflight check before starting:
```bash
cd backend
npm run check
```

Should see: ✅ All checks passed!
