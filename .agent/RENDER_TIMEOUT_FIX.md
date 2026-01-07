# How to fix Render Free Tier Timeouts

Since you are on the Render Free Tier, your server "sleeps" after 15 minutes of inactivity. The first request after sleep takes 60+ seconds to spin up, which causes "Connection Timeout" errors.

## Solution

### 1. I have optimized your backend code:
*   Increased Database Connection Timeout to **30 seconds** (was 5s), giving the database time to wake up.
*   Added a `/api/keep-alive` endpoint.

### 2. You MUST set up a "Pinger" (Do this now):
To stop the server from sleeping, you need an external service to ping it every 14 minutes.

1.  Go to **[cron-job.org](https://cron-job.org)** (It's free).
2.  Create an account.
3.  Click **"Create Cronjob"**.
4.  **Title:** `VanaMap Keep Alive`
5.  **URL:** `https://plantoxy.onrender.com/api/keep-alive`
6.  **Schedule:** Every **14 minutes**.
7.  **Save**.

This will force your Render server to stay awake, fixing 99% of timeout issues.
