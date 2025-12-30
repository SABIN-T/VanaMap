# 🎨 Make It Real - Background Removal Setup Guide

**Last Updated:** 2025-12-30  
**Feature:** AI-Powered Background Removal for AR Plant Placement

---

## 🎯 Overview

The "Make It Real" feature uses **multiple AI background removal strategies** to ensure plants are perfectly cut out and placed in your camera view. The system tries **free AI services first**, then falls back to paid options, and finally uses local processing if all APIs fail.

---

## 🚀 Background Removal Strategies (In Order)

### **Strategy A: Hugging Face RMBG-2.0** ✅ **FREE** (Recommended)
- **Model:** `briaai/RMBG-2.0` (State-of-the-art)
- **Fallback:** `briaai/RMBG-1.4`
- **Cost:** **100% FREE**
- **Quality:** ⭐⭐⭐⭐⭐ Excellent
- **Speed:** ~2-4 seconds
- **Limits:** Rate limited (but generous for free tier)

**Setup:**
1. Visit [Hugging Face](https://huggingface.co/)
2. Create a free account
3. Go to Settings → Access Tokens
4. Create a new token (read access is enough)
5. Add to `.env`:
   ```bash
   VITE_HF_TOKEN=hf_your_token_here
   ```

**Note:** Works without token but with rate limits. Token gives better reliability.

---

### **Strategy B: Replicate API** ✅ **FREE** (with free tier)
- **Model:** RMBG-2.0
- **Cost:** **FREE tier available** (1000 predictions/month)
- **Quality:** ⭐⭐⭐⭐⭐ Excellent
- **Speed:** ~3-5 seconds
- **Limits:** 1000 free predictions/month

**Setup:**
1. Visit [Replicate.com](https://replicate.com/)
2. Sign up for free account
3. Go to Account → API Tokens
4. Copy your API token
5. Add to `.env`:
   ```bash
   VITE_REPLICATE_TOKEN=r8_your_token_here
   ```

**Free Tier:** Perfect for testing and moderate usage!

---

### **Strategy C: Self-Hosted Python Service** ✅ **FREE** (DIY)
- **Library:** `rembg` (U2-Net model)
- **Cost:** **100% FREE** (self-hosted)
- **Quality:** ⭐⭐⭐⭐ Very Good
- **Speed:** ~1-2 seconds (local) / ~3-5 seconds (cloud)
- **Limits:** None (your server capacity)

**Setup (Local Development):**
```bash
# Install Python dependencies
pip install fastapi uvicorn rembg pillow python-multipart

# Create simple API server (save as bg_service.py)
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import Response
from rembg import remove
from PIL import Image
import io

app = FastAPI()

@app.post("/remove-bg")
async def remove_background(file: UploadFile = File(...)):
    input_image = Image.open(io.BytesIO(await file.read()))
    output_image = remove(input_image)
    
    img_byte_arr = io.BytesIO()
    output_image.save(img_byte_arr, format='PNG')
    img_byte_arr.seek(0)
    
    return Response(content=img_byte_arr.read(), media_type="image/png")

# Run with: uvicorn bg_service:app --reload --port 8000
```

**Setup (Deploy to Render.com - FREE):**
1. Create `requirements.txt`:
   ```
   fastapi
   uvicorn
   rembg
   pillow
   python-multipart
   ```

2. Create `render.yaml`:
   ```yaml
   services:
     - type: web
       name: plant-bg-remover
       env: python
       buildCommand: "pip install -r requirements.txt"
       startCommand: "uvicorn bg_service:app --host 0.0.0.0 --port $PORT"
       plan: free
   ```

3. Deploy to Render.com (free tier)
4. Add to `.env`:
   ```bash
   VITE_AI_API_URL=https://your-service.onrender.com
   ```

---

### **Strategy D: Remove.bg** 💰 **PAID** (Last Resort)
- **Service:** Remove.bg API
- **Cost:** **$0.20 per image** (or free tier: 50 images/month)
- **Quality:** ⭐⭐⭐⭐⭐ Excellent
- **Speed:** ~1-2 seconds
- **Limits:** 50 free/month, then paid

**Setup:**
1. Visit [Remove.bg](https://www.remove.bg/api)
2. Sign up and get API key
3. Add to `.env`:
   ```bash
   VITE_REMOVE_BG_API_KEY=your_api_key_here
   ```

**Note:** Only used if all free options fail.

---

### **Strategy E: Local Fallback** ✅ **FREE** (Always Available)
- **Method:** Canvas-based edge detection
- **Cost:** **100% FREE**
- **Quality:** ⭐⭐⭐ Good (basic)
- **Speed:** Instant
- **Limits:** None

**How it works:**
- Analyzes image pixels
- Detects background color
- Removes similar pixels
- Auto-crops to plant content
- **Always works** even offline!

---

## 🔧 Environment Variables Setup

Create a `.env` file in your `frontend/` directory:

```bash
# Recommended: Hugging Face (FREE)
VITE_HF_TOKEN=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Optional: Replicate (FREE tier)
VITE_REPLICATE_TOKEN=r8_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Optional: Self-hosted Python service
VITE_AI_API_URL=http://localhost:8000
# OR for production:
# VITE_AI_API_URL=https://your-bg-service.onrender.com

# Optional: Remove.bg (Paid fallback)
VITE_REMOVE_BG_API_KEY=your_remove_bg_key
```

---

## 📊 Recommended Setup

### **For Development (Local Testing):**
```bash
# Option 1: Just Hugging Face (easiest)
VITE_HF_TOKEN=hf_your_token

# Option 2: Local Python service (best quality + speed)
VITE_AI_API_URL=http://localhost:8000
```

### **For Production (Live Website):**
```bash
# Primary: Hugging Face (free + reliable)
VITE_HF_TOKEN=hf_your_token

# Backup: Replicate (free tier)
VITE_REPLICATE_TOKEN=r8_your_token

# Self-hosted: Deploy Python service to Render
VITE_AI_API_URL=https://your-service.onrender.com
```

---

## ✨ How It Works

1. **User selects a plant** from the database
2. **Image is optimized** (resized to 1024px for best quality/speed)
3. **System tries strategies in order:**
   - ✅ Hugging Face RMBG-2.0 (FREE)
   - ✅ Replicate API (FREE tier)
   - ✅ Python Service (FREE if self-hosted)
   - 💰 Remove.bg (Paid)
   - ✅ Local Fallback (Always works)
4. **First successful strategy wins**
5. **Plant cutout is ready** for AR placement!

---

## 🎨 Features

### **Neural Lighting Adaptation**
- Samples ambient light from camera background
- Adjusts plant colors to match environment
- Creates realistic integration

### **Auto-Correction**
- Brightness adjustment based on surroundings
- Contrast and saturation enhancement
- Ground shadow generation

### **Perfect Pixel Sync**
- Downloaded image matches camera view exactly
- No disproportionate sizing
- High-resolution output (1200px+)

---

## 🐛 Troubleshooting

### **"Processing with AI" stuck loading**
- **Cause:** API rate limit or network issue
- **Solution:** Wait 30 seconds, system will auto-fallback to next strategy

### **"Could not process image"**
- **Cause:** All APIs failed (unlikely)
- **Solution:** Local fallback should always work. Check console for errors.

### **Background not fully removed**
- **Cause:** Complex background or local fallback used
- **Solution:** 
  - Add Hugging Face token for better AI processing
  - Use plants with simpler backgrounds
  - Try different plant images

### **Slow processing**
- **Cause:** Free API rate limits
- **Solution:**
  - Set up local Python service for instant processing
  - Use Replicate free tier (faster than HF)

---

## 📈 Performance Comparison

| Strategy | Speed | Quality | Cost | Reliability |
|----------|-------|---------|------|-------------|
| Hugging Face | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | FREE | ⭐⭐⭐⭐ |
| Replicate | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | FREE* | ⭐⭐⭐⭐⭐ |
| Python (Local) | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | FREE | ⭐⭐⭐⭐⭐ |
| Remove.bg | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | PAID | ⭐⭐⭐⭐⭐ |
| Local Fallback | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | FREE | ⭐⭐⭐⭐⭐ |

*Free tier: 1000/month

---

## 🎯 Best Practices

1. **Always set up Hugging Face token** - It's free and works great!
2. **Deploy Python service to Render** - Free tier is perfect for this
3. **Keep Remove.bg as last resort** - Save money, use free options first
4. **Local fallback always works** - No setup needed, instant processing

---

## 🚀 Quick Start (Minimal Setup)

**Just want it to work? Do this:**

1. Get a free Hugging Face token:
   ```bash
   # Visit https://huggingface.co/settings/tokens
   # Create token, copy it
   ```

2. Add to `.env`:
   ```bash
   VITE_HF_TOKEN=hf_your_token_here
   ```

3. **Done!** The feature now has AI-powered background removal.

If Hugging Face fails, the system automatically falls back to local processing (which always works).

---

## 📝 Summary

- ✅ **5 strategies** ensure background removal always works
- ✅ **3 free options** (Hugging Face, Replicate free tier, Python)
- ✅ **Local fallback** means it never fails
- ✅ **Neural lighting** makes plants look realistic
- ✅ **Perfect sync** between camera and download

**Recommended:** Set up Hugging Face token (free, 2 minutes) for best results!

---

**Last Updated:** 2025-12-30  
**Status:** ✅ Fully Functional with Multiple Free AI Options
