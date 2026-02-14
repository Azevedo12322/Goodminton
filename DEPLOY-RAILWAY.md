# Deploy Goodminton to Railway

Follow these steps to get your site live on Railway.

## Option A: Deploy from GitHub (recommended)

### 1. Push your code to GitHub

If the project isn’t on GitHub yet:

```bash
# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/Goodminton.git
git add .
git commit -m "Ready for Railway deploy"
git push -u origin main
```

(Use your actual repo URL and branch name if different.)

### 2. Create a Railway project

1. Go to **[railway.com](https://railway.com)** and sign in (or create an account).
2. Click **“New Project”**.
3. Choose **“Deploy from GitHub repo”**.
4. If asked, connect your GitHub account and authorize Railway.
5. Select the **Goodminton** repository.
6. Railway will create a new service and start a build automatically.

### 3. Get a public URL

1. Open your **service** (the Goodminton app).
2. Go to the **Settings** tab.
3. Under **Networking**, click **Generate Domain**.
4. Railway will assign a URL like `https://goodminton-production-xxxx.up.railway.app`.
5. Open that URL to see your deployed site.

### 4. Same scores on PC and mobile (required for sync)

**Without this, the PC and mobile can show different data** because each deploy or instance uses its own temporary storage.

1. In your service, go to **Settings** → **Volumes**.
2. Click **Add Volume**. Set the mount path to **`/data`**.
3. Go to **Variables** and add: **`DATA_PATH`** = **`/data`**.
4. Redeploy the service so the volume is attached.

After this, all devices will read and write the same `state.json` on the volume, so scores stay in sync.

### 5. Automatic deploys (optional)

With “Deploy from GitHub”, every push to the connected branch (e.g. `main`) will trigger a new deploy. No extra setup needed. Keep the volume and `DATA_PATH` variable so scores stay in sync after each deploy.

---

## Option B: Deploy with Railway CLI

If you prefer to deploy from your machine without GitHub:

### 1. Install and log in

```bash
npm install -g @railway/cli
railway login
```

### 2. Deploy from the project folder

```bash
cd /Users/mbp13/Desktop/Goodminton/Goodminton
railway init   # create/link a project (follow prompts)
railway up     # build and deploy
```

### 3. Generate a domain

In the [Railway dashboard](https://railway.com/dashboard): open your service → **Settings** → **Networking** → **Generate Domain**.

---

## Troubleshooting

- **Build fails:** Check the **Deployments** tab and open the latest build logs. Common fixes: run `npm run build` locally to confirm it works; ensure `railway.toml` and `package.json` (with `start` script and `serve` dependency) are committed.
- **Blank page or 404:** The app uses client-side routing; `serve -s dist` in the start command handles this. If you changed the start command, keep the `-s` flag so all routes serve `index.html`.
- **Need a custom domain:** In the service **Settings** → **Networking**, use **Custom Domain** and follow Railway’s DNS instructions.
