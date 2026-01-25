# 🚀 StoryConnect Deployment Guide

Complete guide to deploy StoryConnect online using Render, Vercel, or other platforms.

## 📋 Pre-Deployment Checklist

✅ All code tested locally  
✅ Database schema created  
✅ Environment variables documented  
✅ .gitignore configured properly  
✅ README updated  

---

## 🌐 Deployment Options

### Option 1: Render (Recommended - Free Tier Available)

#### Backend Deployment (Render Web Service)

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select `backend` directory as Root Directory

3. **Configure Service**
   ```
   Name: storyconnect-backend
   Environment: Node
   Region: Choose nearest
   Branch: main (or your branch)
   Root Directory: backend
   Build Command: npm install
   Start Command: npm start
   ```

4. **Add Environment Variables**
   ```
   DB_HOST=<your-mysql-host>
   DB_USER=<your-mysql-user>
   DB_PASSWORD=<your-mysql-password>
   DB_NAME=storyconnect
   DB_PORT=3306
   JWT_SECRET=7e2b1c8f2a4d4e6b9c3f5a1e7d8b6c2f4a9e3b7c1d5f8a2e6c4b9d7f1a3e5c8b
   GEMINI_API_KEY=<optional>
   PORT=5000
   ```

5. **MySQL Database Options**
   - Use Render PostgreSQL (Free tier, requires schema migration)
   - Use Railway MySQL (Free tier with credit)
   - Use PlanetScale (Free tier)
   - Use your own MySQL server

#### Frontend Deployment (Render Static Site or Vercel)

**Option A: Render Static Site**

1. **Create New Static Site**
   - Click "New +" → "Static Site"
   - Connect your GitHub repository
   - Select `frontend` directory

2. **Configure**
   ```
   Name: storyconnect-frontend
   Root Directory: frontend
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```

3. **Environment Variables**
   ```
   VITE_API_URL=https://storyconnect-backend.onrender.com/api
   GEMINI_API_KEY=<optional>
   ```

**Option B: Vercel (Faster builds)**

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy Frontend**
   ```bash
   cd frontend
   vercel
   ```

3. **Add Environment Variables in Vercel Dashboard**
   ```
   VITE_API_URL=https://storyconnect-backend.onrender.com/api
   ```

---

### Option 2: Railway (Simple, Free Tier)

#### Backend + Database

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

3. **Add MySQL Database**
   - Click "New" → "Database" → "MySQL"
   - Railway will auto-generate connection details

4. **Configure Backend Service**
   ```
   Root Directory: backend
   Build Command: npm install
   Start Command: npm start
   ```

5. **Add Environment Variables**
   - Use MySQL variables from Railway
   - Add JWT_SECRET and other required vars

#### Frontend (Vercel or Netlify)

Same as above, update VITE_API_URL to Railway backend URL

---

### Option 3: Heroku (Paid - No free tier anymore)

#### Backend

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Create Heroku App**
   ```bash
   cd backend
   heroku create storyconnect-backend
   ```

3. **Add MySQL Addon**
   ```bash
   heroku addons:create jawsdb:kitefin
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set JWT_SECRET=your_secret
   heroku config:set GEMINI_API_KEY=your_key
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

---

## 🗄️ Database Migration (If switching from MySQL to PostgreSQL)

### Update Backend for PostgreSQL

1. **Install pg instead of mysql2**
   ```bash
   npm uninstall mysql2
   npm install pg
   ```

2. **Update database.js**
   ```javascript
   const { Pool } = require('pg');
   
   const pool = new Pool({
     connectionString: process.env.DATABASE_URL,
     ssl: { rejectUnauthorized: false }
   });
   ```

3. **Update SQL Queries**
   - Change `?` placeholders to `$1, $2, $3...`
   - Update AUTO_INCREMENT to SERIAL
   - Update DATETIME to TIMESTAMP

---

## 🔧 Environment Variables Reference

### Backend (.env)
```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=storyconnect
DB_PORT=3306

# Security
JWT_SECRET=your_long_random_string_here

# Optional
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend.onrender.com/api
GEMINI_API_KEY=your_gemini_api_key
```

---

## 📝 Post-Deployment Steps

### 1. Test API Endpoints
```bash
curl https://your-backend.onrender.com/api/test
```

### 2. Create Admin User
```sql
INSERT INTO users (id, username, email, password, role) 
VALUES (
  'admin-id', 
  'admin', 
  'admin@storyconnect.com', 
  '$2a$10$hashed_password', 
  'ADMIN'
);
```

### 3. Update CORS Settings
In `backend/src/server.js`:
```javascript
app.use(cors({
  origin: ['https://your-frontend.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
```

### 4. Enable HTTPS
- Most platforms (Render, Vercel) auto-enable HTTPS
- Update all URLs to use `https://`

---

## 🐛 Common Deployment Issues

### Issue: Database Connection Timeout
**Solution:** Check database host is accessible from deployment platform
```javascript
// Add connection timeout
const pool = mysql.createPool({
  ...config,
  connectTimeout: 60000
});
```

### Issue: CORS Errors
**Solution:** Update backend CORS configuration
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
```

### Issue: File Upload Fails
**Solution:** Use cloud storage (AWS S3, Cloudinary)
```bash
npm install cloudinary
```

### Issue: Build Fails
**Solution:** Check Node version matches
```json
// package.json
"engines": {
  "node": ">=16.0.0"
}
```

---

## 📊 Monitoring & Logs

### Render
- View logs in Render Dashboard → Service → Logs
- Set up log drains for persistent logs

### Vercel
- View deployment logs in Vercel Dashboard
- Enable Analytics (paid feature)

### Railway
- View logs in Railway Dashboard
- Real-time log streaming available

---

## 💰 Cost Estimation

### Free Tier (Recommended for Testing)
- **Render:** 750 hours/month web service + 100GB bandwidth
- **Vercel:** Unlimited deployments + 100GB bandwidth
- **Railway:** $5 free credit/month
- **PlanetScale:** 1 database free

**Total Cost:** $0-5/month

### Production Tier
- **Render Pro:** $7/month per service
- **Vercel Pro:** $20/month
- **Railway:** $5-20/month
- **Database:** $5-15/month

**Total Cost:** $20-50/month

---

## 🔐 Security Best Practices

1. **Never commit .env files**
   ```bash
   # Add to .gitignore
   .env
   .env.local
   .env.production
   ```

2. **Use strong JWT secrets**
   ```bash
   # Generate random secret
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

3. **Enable rate limiting**
   ```bash
   npm install express-rate-limit
   ```

4. **Use environment-specific configs**
   ```javascript
   const isProduction = process.env.NODE_ENV === 'production';
   ```

---

## 📞 Support

**Developer:** Malipeddi Sekhar  
**Email:** malipeddisekhar63@gmail.com  
**Location:** Srikakulam District, Muddada village  
**Response Time:** Within 24 hours

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Backend deployed to Render/Railway
- [ ] Database created and schema imported
- [ ] Environment variables configured
- [ ] Frontend deployed to Vercel/Netlify
- [ ] Frontend API URL updated
- [ ] CORS configuration updated
- [ ] Test API endpoints
- [ ] Test frontend-backend connection
- [ ] Create admin user
- [ ] Test file uploads
- [ ] Monitor logs for errors
- [ ] Set up custom domain (optional)
- [ ] Enable HTTPS
- [ ] Update README with live URLs

---

**Good luck with your deployment! 🚀**
