# StoryConnect - Render Deployment Guide

## Prerequisites
- GitHub account with your StoryConnect repository
- Render account (sign up at https://render.com)

## Step-by-Step Deployment Instructions

### 1. Create a MySQL Database on Render

1. Go to https://render.com and log in
2. Click **"New +"** → **"MySQL"**
3. Configure the database:
   - **Name**: `storyconnect-db`
   - **Database**: `storyconnect`
   - **User**: (auto-generated)
   - **Region**: Oregon (or closest to you)
   - **Plan**: Free
4. Click **"Create Database"**
5. **IMPORTANT**: Save these connection details (you'll need them):
   - Internal Database URL
   - Hostname
   - Username
   - Password
   - Database Name
   - Port

### 2. Run Database Setup Script

After the database is created:

1. In Render dashboard, go to your MySQL database
2. Click on **"Connect"** → **"External Connection"** 
3. Use a MySQL client (like MySQL Workbench, DBeaver, or command line) to connect
4. Run the SQL script from `backend/setup-database.sql`

OR use the Render Shell (if available):
1. Click "Shell" in your database dashboard
2. Copy and paste the SQL from `setup-database.sql`

### 3. Deploy from Blueprint

1. In Render dashboard, click **"New +"** → **"Blueprint"**
2. Connect your GitHub repository: `malipeddisekhar/Story-Connect`
3. Render will detect `render.yaml` and show two services:
   - `storyconnect-backend` (Web Service)
   - `storyconnect-frontend` (Static Site)
4. Click **"Apply"** to create both services

### 4. Configure Backend Environment Variables

1. Go to **storyconnect-backend** service
2. Click **"Environment"** tab
3. Add these environment variables:

```
DB_HOST = <your-render-mysql-hostname>
DB_USER = <your-render-mysql-username>
DB_PASSWORD = <your-render-mysql-password>
DB_NAME = storyconnect
JWT_SECRET = storyconnect_secret_key_2026_render_production
PORT = 10000
FRONTEND_URL = https://storyconnect-frontend.onrender.com
```

**Get DB credentials from your Render MySQL database "Connect" section**

4. Click **"Save Changes"**
5. The backend will automatically redeploy

### 5. Configure Frontend Environment Variables

1. Go to **storyconnect-frontend** service
2. Click **"Environment"** tab
3. Add this environment variable:

```
VITE_API_URL = https://storyconnect-backend.onrender.com/api
```

4. Click **"Save Changes"**
5. The frontend will automatically redeploy

### 6. Wait for Deployment

- Both services will build and deploy (takes 5-15 minutes)
- Monitor the logs in each service's "Logs" tab
- Wait for both to show **"Live"** status

### 7. Test Your Deployment

1. **Test Backend API**:
   - Visit: `https://storyconnect-backend.onrender.com/api/test`
   - Should return: `{"message": "Database connected successfully!"}`

2. **Test Frontend**:
   - Visit: `https://storyconnect-frontend.onrender.com`
   - You should see your StoryConnect website!

3. **Test Login**:
   - Use the sample accounts from the database:
     - Admin: `admin@storyconnect.com` / `password123`
     - Author: `jane@storyconnect.com` / `password123`
     - Reader: `reader@storyconnect.com` / `password123`

## Important Notes

### Free Tier Limitations
- Services sleep after 15 minutes of inactivity
- First request after sleep takes ~30 seconds to wake up
- Database has 1GB storage limit

### Custom Domain (Optional)
1. Go to each service
2. Click "Settings" → "Custom Domain"
3. Add your domain and configure DNS

### Troubleshooting

**If backend fails to connect to database:**
- Verify all DB environment variables are correct
- Check the database is running in Render dashboard
- Look at backend logs for error messages

**If frontend can't reach backend:**
- Verify `VITE_API_URL` is set correctly
- Check backend service is "Live"
- Open browser console to see API errors

**Build failures:**
- Check the build logs for specific errors
- Ensure `package.json` has all dependencies
- Verify Node.js version compatibility

## Your Deployed URLs

- **Frontend**: https://storyconnect-frontend.onrender.com
- **Backend API**: https://storyconnect-backend.onrender.com
- **API Test**: https://storyconnect-backend.onrender.com/api/test

## Next Steps

1. Monitor your services in the Render dashboard
2. Set up monitoring/alerts if needed
3. Consider upgrading to paid tier for production use
4. Add custom domain for professional look
5. Set up continuous deployment (auto-deploy on git push)

---

**Your code is ready and pushed to GitHub. Follow these steps to deploy!** 🚀
