<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Goodminton

Torneio Badminton 12ºCT1 — run and deploy this app locally or to Railway.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. (Optional) Create a `.env` file with `VITE_ADMIN_PASSWORD=your_secret_password` for admin login.
3. **Run the app** – choose one:

   **Option A – Single server (build + start)**  
   ```bash
   npm run build
   npm start
   ```
   Then open **http://localhost:3000**. The app and API run together; state is saved to `data/state.json`.

   **Option B – Dev with hot reload (two terminals)**  
   - Terminal 1: `npm run dev:server` (API on port 3001)  
   - Terminal 2: `npm run dev` (Vite on port 3000)  
   Open **http://localhost:3000**. Vite proxies `/api` to the server; state is saved to `data/state.json`.

## Deploy to Railway

**Prerequisites:** A [Railway](https://railway.com) account and (optional) GitHub repo.

1. **Push your code to GitHub** (if not already):
   - Create a repo and push this project.

2. **Create a new project on Railway:**
   - Go to [railway.com/new](https://railway.com/new).
   - Choose **Deploy from GitHub repo** and select your Goodminton repository.

3. **Configure the service:**
   - Build: `npm run build`. Start: `npm start` (Node server serves API + static app).
   - **Variables** (service → Variables): set **`VITE_ADMIN_PASSWORD`** (for frontend admin login) and **`ADMIN_PASSWORD`** (for API; use the same value). Both are required for admin to save scores.
   - **Volume (required for persistent scores):** In the service → **Settings** → **Volumes** → **Add Volume**. Mount path: **`/data`**. Then add variable **`DATA_PATH=/data`** so the server stores `state.json` on the volume. Without this, scores reset on redeploy.

4. **Get a public URL:**
   - **Settings** → **Networking** → **Generate Domain**.
   - Your app will be live at that URL. Admin score updates are saved on the volume and visible to all users.
