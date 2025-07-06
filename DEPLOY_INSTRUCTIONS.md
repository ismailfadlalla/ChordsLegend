# 🌐 Deploy ChordsLegend API to Cloud

## Option 1: Heroku (Recommended - Free Tier Available)

### Prerequisites

1. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
2. Create a free Heroku account: https://signup.heroku.com/

### Deploy Steps

```bash
# 1. Navigate to server directory
cd server

# 2. Initialize git repository
git init
git add .
git commit -m "Initial commit"

# 3. Login to Heroku
heroku login

# 4. Create Heroku app
heroku create chordslegend-api

# 5. Deploy to Heroku
git push heroku main

# 6. Get your app URL
heroku open
```

Your API will be available at: `https://chordslegend-api.herokuapp.com`

### Update .env file

Replace in your `.env`:

```
EXPO_PUBLIC_API_URL=https://chordslegend-api.herokuapp.com
API_URL=https://chordslegend-api.herokuapp.com
```

## Option 2: Railway (Easy Alternative)

1. Go to https://railway.app/
2. Connect your GitHub account
3. Create new project from GitHub repo
4. Railway will auto-deploy your Python app
5. Get the public URL

## Option 3: Render (Free Tier)

1. Go to https://render.com/
2. Create account and connect GitHub
3. Create new "Web Service"
4. Point to your server folder
5. Set build command: `pip install -r requirements.txt`
6. Set start command: `python app.py`

## Option 4: Vercel (Serverless)

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in server directory
3. Follow prompts to deploy

## Testing Your Deployed API

Once deployed, test the endpoints:

- `GET /` - Health check
- `POST /analyze` - Chord analysis

```bash
curl https://your-app-url.herokuapp.com/
curl -X POST https://your-app-url.herokuapp.com/analyze \
  -H "Content-Type: application/json" \
  -d '{"youtube_url": "https://youtube.com/watch?v=test"}'
```

## Building New APK

After deploying, update your .env file and build a new APK:

```bash
npx eas build --platform android --profile preview
```
