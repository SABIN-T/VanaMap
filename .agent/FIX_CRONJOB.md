# Fix Cron-Job.org Configuration

## Problem
Your cron job is getting **404 Not Found** because the URL is incorrect.

## Solution

### Step 1: Edit Your Cron Job
1. Go to [cron-job.org](https://cron-job.org/en/members/jobs/)
2. Click on your **"vanamap"** job
3. Click **"Edit"** or the pencil icon

### Step 2: Update the URL
Change the URL to:
```
https://plantoxy.onrender.com/api/keep-alive
```

**Important:** Make sure it's the **full URL** with `https://`

### Step 3: Verify Settings
- **Schedule:** Every **14 minutes** (or `*/14 * * * *` in cron format)
- **Enabled:** ✅ Yes
- **Timeout:** 30 seconds (default is fine)

### Step 4: Test It
1. Click **"Save"**
2. Click **"Execute now"** to test
3. You should see **"Success"** instead of **"404 Not Found"**

## Expected Result
After fixing, you should see:
- ✅ Status: **Success (HTTP 200)**
- ✅ Response: **"I am awake!"**
- ✅ Duration: ~200-500ms

## Verification
Your backend will now stay awake 24/7 because:
- Render sleeps after **15 minutes** of inactivity
- Cron-job pings every **14 minutes**
- Server never sleeps! 🎉

## Troubleshooting
If it still fails:
1. Check if `https://plantoxy.onrender.com` is accessible
2. Try the URL in your browser first
3. Make sure your Render service is running
