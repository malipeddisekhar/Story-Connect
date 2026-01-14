@echo off
echo ========================================
echo StoryConnect - Render Deployment Guide
echo ========================================
echo.
echo STEP 1: Run SQL Script on Render Database
echo -----------------------------------------
echo.
echo 1. Go to your Render PostgreSQL database page
echo 2. Look for "Connect" button and click it
echo 3. Choose "Web Shell" or "psql" option
echo 4. The SQL script is already in your clipboard
echo 5. Paste it (Ctrl+V or Right-click -> Paste)
echo 6. Press Enter to execute
echo 7. Wait for "Database setup complete!" message
echo.
echo.
echo STEP 2: Deploy via Blueprint
echo -----------------------------
echo.
echo 1. Go to Render Dashboard
echo 2. Click "New +" button (top right)
echo 3. Select "Blueprint"
echo 4. Connect repository: malipeddisekhar/Story-Connect
echo 5. Click "Apply"
echo.
echo.
echo STEP 3: Configure Backend Environment Variables
echo ------------------------------------------------
echo.
echo Go to storyconnect-backend service and add:
echo.
echo DB_HOST = dpg-d5jhum1r0fns73d406d0-a.oregon-postgres.render.com
echo DB_USER = (copy from Render database page)
echo DB_PASSWORD = (copy from Render database page)
echo DB_NAME = storyconnect
echo DB_PORT = 5432
echo DB_SSL = true
echo JWT_SECRET = storyconnect_secret_key_2026_render_production
echo PORT = 10000
echo FRONTEND_URL = https://storyconnect-frontend.onrender.com
echo.
echo.
echo STEP 4: Configure Frontend Environment Variables
echo -------------------------------------------------
echo.
echo Go to storyconnect-frontend service and add:
echo.
echo VITE_API_URL = https://storyconnect-backend.onrender.com/api
echo.
echo.
echo ========================================
echo Your app will be live at:
echo Frontend: https://storyconnect-frontend.onrender.com
echo Backend: https://storyconnect-backend.onrender.com
echo ========================================
echo.
pause
