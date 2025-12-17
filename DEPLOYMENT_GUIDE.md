# Deployment Guide for PlantFinder

## 1. Prerequisites
- A GitHub account.
- A **MongoDB Atlas** account (free tier) for the database.
- Accounts on **Vercel** (for Frontend) and **Render** (for Backend).

## 2. Database Setup (MongoDB Atlas)
1.  Create a cluster on MongoDB Atlas.
2.  Go to **Network Access** -> Add IP Address -> Allow Access from Anywhere (`0.0.0.0/0`) (easiest for deployment).
3.  Go to **Database Access** -> Create a database user (e.g., `admin`). Save the password.
4.  Get your **Connection String** (e.g., `mongodb+srv://admin:<password>@cluster0.p123.mongodb.net/?retryWrites=true&w=majority`).

## 3. Backend Deployment (Render.com)
1.  Push your code to GitHub.
2.  Log in to Render and click **New +** -> **Web Service**.
3.  Connect your GitHub repo.
4.  **Root Directory**: `backend` (Important! Your backend is now in the backend folder).
5.  **Build Command**: `npm install`
6.  **Start Command**: `node index.js`
7.  **Environment Variables**:
    - `MONGO_URI`: (Paste your MongoDB Atlas connection string here)
    - `PORT`: `3000` (Render might override this, which is fine).
8.  Click **Deploy**.
9.  Copy the URL Render gives you (e.g., `https://plant-finder-api.onrender.com`). THIS IS YOUR NEW API URL.

## 4. Frontend Deployment (Vercel)
1.  Log in to Vercel and **Add New Project**.
2.  Select your GitHub repo.
3.  **Framework Preset**: Vite.
4.  **Root Directory**: `frontend` (Important! Select the frontend folder).
5.  **Environment Variables**:
    - Name: `VITE_API_URL`
    - Value: `https://plant-finder-api.onrender.com/api` (The URL from step 3, plus `/api` at the end).
6.  Click **Deploy**.

## 5. Verify
- Open your Vercel URL.
- Try searching for a location. If the backend is connected, it will work just like local!
