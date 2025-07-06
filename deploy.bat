@echo off
echo 🚀 ChordsLegend API Deployment Guide
echo.
echo OPTION 1: Railway (Recommended)
echo 1. Go to https://railway.app/
echo 2. Sign up with GitHub
echo 3. Click "Deploy from GitHub repo"
echo 4. Select this repository
echo 5. Set root directory to "server"
echo 6. Railway will auto-deploy!
echo.
echo OPTION 2: Heroku
echo 1. Install Heroku CLI
echo 2. Run: heroku login
echo 3. Run: heroku create chordslegend-api
echo 4. cd server
echo 5. git init && git add . && git commit -m "Deploy"
echo 6. git push heroku main
echo.
echo OPTION 3: Quick Test (Keep computer running)
echo Run: python server/app.py
echo Your API will be at: http://192.168.1.138:5000
echo.
pause
