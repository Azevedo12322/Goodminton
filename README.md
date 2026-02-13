<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Goodminton

Torneio Badminton 12ºCT1 — run and deploy this app locally or to Railway.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`

## Deploy to Railway

**Prerequisites:** A [Railway](https://railway.com) account and (optional) GitHub repo.

1. **Push your code to GitHub** (if not already):
   - Create a repo and push this project.

2. **Create a new project on Railway:**
   - Go to [railway.com/new](https://railway.com/new).
   - Choose **Deploy from GitHub repo** and select your Goodminton repository.

3. **Configure the service (if needed):**
   - Railway will use `railway.toml`: build = `npm run build`, start = `npm start` (serves the built app from `dist/`).

4. **Get a public URL:**
   - In the service → **Settings** → **Networking** → **Generate Domain**.
   - Your app will be live at the generated URL (e.g. `https://your-app.up.railway.app`).
