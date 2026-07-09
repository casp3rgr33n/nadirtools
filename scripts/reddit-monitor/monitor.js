import Snoowrap from "snoowrap";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config();

// Configuration
const SUBREDDITS = ["webdev", "sysadmin", "learnprogramming", "linux", "networking"];
const KEYWORDS = [
  "subnet calculator", "cidr", 
  "json parser", "json formatter", 
  "cron expression", "cron generator",
  "uuid generator", "guid generator"
];
const CHECK_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

// File paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SEEN_POSTS_FILE = path.join(__dirname, "seen_posts.json");

// Load seen posts
let seenPosts = new Set();
if (fs.existsSync(SEEN_POSTS_FILE)) {
  try {
    const data = JSON.parse(fs.readFileSync(SEEN_POSTS_FILE, "utf-8"));
    seenPosts = new Set(data);
  } catch (err) {
    console.error("Error reading seen posts:", err);
  }
}

function saveSeenPosts() {
  // Keep only the latest 1000 to prevent infinite file growth
  const arr = Array.from(seenPosts).slice(-1000);
  fs.writeFileSync(SEEN_POSTS_FILE, JSON.stringify(arr, null, 2));
}

// Initialize Reddit Client
const r = new Snoowrap({
  userAgent: "NadirTools Keyword Monitor Bot v1.0 by u/" + process.env.REDDIT_USERNAME,
  clientId: process.env.REDDIT_CLIENT_ID,
  clientSecret: process.env.REDDIT_CLIENT_SECRET,
  username: process.env.REDDIT_USERNAME,
  password: process.env.REDDIT_PASSWORD
});

// Function to send Discord webhook
async function sendDiscordAlert(post, keyword) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return;

  const payload = {
    content: `🚨 **New Opportunity on Reddit!** 🚨\n\n**Subreddit:** r/${post.subreddit.display_name}\n**Keyword Hit:** \`${keyword}\`\n**Title:** ${post.title}\n**Link:** https://reddit.com${post.permalink}\n\n*Drop a helpful reply with a NadirTools link!*`
  };

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    console.log(`[ALERT SENT] ${post.id}`);
  } catch (err) {
    console.error("Error sending Discord webhook:", err);
  }
}

async function checkSubreddits() {
  console.log(`[${new Date().toISOString()}] Checking subreddits: ${SUBREDDITS.join(", ")}`);
  
  for (const sub of SUBREDDITS) {
    try {
      // Fetch the 25 newest posts in the subreddit
      const newPosts = await r.getSubreddit(sub).getNew({ limit: 25 });
      
      for (const post of newPosts) {
        if (seenPosts.has(post.id)) continue;

        const combinedText = (post.title + " " + post.selftext).toLowerCase();
        
        for (const keyword of KEYWORDS) {
          if (combinedText.includes(keyword)) {
            console.log(`[MATCH] Found '${keyword}' in r/${sub}: ${post.title}`);
            await sendDiscordAlert(post, keyword);
            break; // Send alert only once per post
          }
        }
        
        seenPosts.add(post.id);
      }
    } catch (err) {
      console.error(`Error fetching r/${sub}:`, err.message);
    }
  }
  
  saveSeenPosts();
  console.log(`[${new Date().toISOString()}] Check complete. Sleeping...`);
}

// Start loop
console.log("🚀 NadirTools Reddit Monitor Started.");
checkSubreddits();
setInterval(checkSubreddits, CHECK_INTERVAL_MS);
