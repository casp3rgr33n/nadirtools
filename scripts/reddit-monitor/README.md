# Reddit Keyword Monitor Bot

This bot monitors specific subreddits for keywords related to your tools (e.g., "subnet calculator") and sends a Discord alert when a match is found. This allows you to jump into the thread manually and drop a highly-relevant, helpful link to NadirTools, ensuring zero-cost distribution without violating Reddit's spam policies.

## 1. Get Reddit Credentials
1. Log into your Reddit account.
2. Go to [Reddit App Preferences](https://www.reddit.com/prefs/apps).
3. Click **"Create another app..."** at the bottom.
4. Fill it out:
   - **Name**: NadirTools Monitor (or anything)
   - **Type**: Select `script`
   - **Description**: Optional
   - **About URL**: Leave blank
   - **Redirect URI**: `http://localhost:8080`
5. Click **Create app**.
6. Note the **Client ID** (under the app name) and the **Secret**.

## 2. Get Discord Webhook
1. Open your Discord Server.
2. Go to Server Settings > Integrations > Webhooks.
3. Click **New Webhook**, name it "Reddit Bot", and choose a channel.
4. Click **Copy Webhook URL**.

## 3. Configuration
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Paste your Reddit credentials and Discord Webhook URL into the `.env` file.

## 4. Run the Bot
First, install the dependencies:
```bash
npm install
```

Then start the bot:
```bash
npm start
```

### Running in the Background
To keep it running 24/7 on a server or VPS, install `pm2`:
```bash
npm install -g pm2
pm2 start monitor.js --name "reddit-monitor"
pm2 save
```
