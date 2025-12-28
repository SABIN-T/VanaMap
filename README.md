# VanaMap Project

## Architecture Overview

This project uses a modern **Hybrid Architecture** across three tiers:

### 1. Frontend (`/frontend`)
*   **Tech**: React, Vite, TypeScript, TailwindCSS.
*   **Hosting**: Vercel / Netlify.
*   **Key Feature**: "Neural Studio" (Make It Real) uses a client-side Adaptive AI pipeline for background removal.

### 2. Main Backend (`/backend`)
*   **Tech**: Node.js, Express, MongoDB.
*   **Hosting**: Render (Web Service).
*   **Role**: Handles Users, Plants Database, Gamification, and Cart.
*   **Live URL**: `https://plantoxy.onrender.com`

### 3. AI Engine (`/ai-service`)
*   **Tech**: Python, FastAPI, U2-Net / Rembg.
*   **Hosting**: Render (Web Service) *[Optional Backup]*.
*   **Role**: Provides fallback background removal if public APIs fail.

---

## 🧠 Neural Studio: Background Removal Strategy

The "Make It Real" feature uses an **Adaptive 4-Layer Strategy** to ensure it *always* works:

| Priority | Strategy | Speed | Quality | Note |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **Remove.bg API** | ⚡ Instant | ⭐⭐⭐⭐⭐ Highest | Uses `VITE_REMOVE_BG_API_KEY` |
| **2** | **Hugging Face** | 🚀 Fast | ⭐⭐⭐⭐ High | Uses free Inference API |
| **3** | **Python Service** | 🐢 Slower | ⭐⭐⭐⭐ High | Self-hosted fallback (if deployed) |
| **4** | **Basic Cutout** | ⚡ Instant | ⭐⭐ Valid | Works 100% offline (Canvas) |

> **Status**: The project is currently configured to use **Strategy 1 (Remove.bg)** by default for best results.

---

## Running Locally

1. **Start Backend**: `cd backend && npm start`
2. **Start AI Service**: `./start-ai-service.bat` (Windows)
3. **Start Frontend**: `cd frontend && npm run dev`

