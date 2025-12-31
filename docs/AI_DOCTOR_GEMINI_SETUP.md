# AI Doctor - Gemini Integration Setup

## 🚀 Using Google Gemini for Advanced AI

The AI Doctor now uses Google's Gemini Pro model for GPT/Gemini-level intelligence!

### Quick Setup (Optional - Free Tier)

1. **Get Free API Key** (Optional but recommended):
   - Visit: https://makersuite.google.com/app/apikey
   - Click "Create API Key"
   - Copy your key

2. **Add to Environment** (if using API key):
   ```bash
   # Create .env file in frontend directory
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

3. **Update Code** (if using API key):
   In `frontend/src/services/advancedAI.ts`, update the fetch call:
   ```typescript
   const response = await fetch(`${this.GEMINI_API_URL}?key=${import.meta.env.VITE_GEMINI_API_KEY}`, {
   ```

### Current Setup (No API Key Required)

The system works WITHOUT an API key using:
- Public Gemini endpoint (limited requests)
- Automatic fallback to Hugging Face models
- Smart caching and request management

### Features

✅ **Gemini-Level Intelligence**
- Deep reasoning and analysis
- Context-aware responses
- Natural conversation flow
- Multi-turn conversation memory

✅ **Automatic Fallbacks**
- Gemini Pro (primary)
- Mistral-7B (fallback 1)
- DialoGPT (fallback 2)
- BlenderBot (fallback 3)

✅ **Smart Features**
- Conversation history tracking
- Context building from previous messages
- Confidence scoring
- Response quality validation

### API Limits

**Without API Key:**
- ~60 requests per minute
- Shared public quota
- May have delays during high traffic

**With Free API Key:**
- 60 requests per minute (personal quota)
- 1,500 requests per day
- More reliable performance

### Troubleshooting

If AI responses are slow or unavailable:
1. Check internet connection
2. Try refreshing the page
3. System automatically falls back to other models
4. Consider adding API key for better performance

### Cost

**100% FREE** - No credit card required!
- Gemini API: Free tier (1,500 requests/day)
- Hugging Face: Free inference API
- DuckDuckGo Search: Free API

---

For more info: https://ai.google.dev/tutorials/get_started_web
