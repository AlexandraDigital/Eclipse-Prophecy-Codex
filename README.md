# ⬡ The Eclipse Prophecy Codex— RPG

An immersive AI-powered RPG running on **Groq** (llama-3.3-70b) with a **Cloudflare Pages** backend.

---

## Quick Deploy

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOU/eclipse-rpg.git
git push -u origin main
```

### 2. Create Cloudflare Pages Project
1. Go to [Cloudflare Pages](https://pages.cloudflare.com/)
2. Click **Create a project** → **Connect to Git**
3. Select your repository

### 3. Build Settings
| Setting | Value |
|---|---|
| Framework preset | `Vite` |
| Build command | `npm run build` |
| Build output directory | `dist` |

### 4. Add your Groq API Key
In Cloudflare Pages → **Settings** → **Environment Variables**:

| Variable | Value |
|---|---|
| `GROQ_API_KEY` | `gsk_your_key_here` |

Set it for both **Production** and **Preview** environments.

> Get your free key at [console.groq.com](https://console.groq.com)

### 5. Deploy
Click **Save and Deploy**. Done! 🎉

---

## Local Development

```bash
npm install
npm run dev
```

> Note: `/api/chat` won't work locally without a Cloudflare Workers runtime.
> For local testing, use [Wrangler](https://developers.cloudflare.com/workers/wrangler/):
> ```bash
> npx wrangler pages dev dist --binding GROQ_API_KEY=gsk_your_key
> ```

---

## Project Structure

```
eclipse-rpg/
├── functions/
│   └── api/
│       └── chat.js        ← Cloudflare Pages Function (Groq proxy)
├── src/
│   ├── main.jsx
│   └── App.jsx            ← Full RPG game
├── index.html
├── vite.config.js
└── package.json
```

## Model
Using `llama-3.3-70b-versatile` on Groq — extremely fast and high quality for RPG narration.
Change the model in `functions/api/chat.js` if desired.
