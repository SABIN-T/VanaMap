# OpenAI Integration for AI Doctor

## 🚀 Quick Setup

Your OpenAI API key has been configured! Follow these steps to activate the AI Doctor:

### Option 1: Automatic Setup (Recommended)

**Windows:**
```bash
cd backend
setup-openai.bat
```

This script will:
- ✅ Backup your existing `.env` file
- ✅ Add or update the `OPENAI_API_KEY`
- ✅ Preserve all other environment variables

### Option 2: Manual Setup

1. **Open the `.env` file** in the `backend` folder
2. **Add this line** (or update if it exists):
```
OPENAI_API_KEY=your_openai_api_key_here
```
3. **Save the file**

---

## 🔧 How It Works

### Backend API Endpoint
The backend already has a `/api/chat` endpoint configured at line 2150-2183 of `index.js`:

```javascript
app.post('/api/chat', async (req, res) => {
    const { model, messages } = req.body;
    const apiKey = process.env.OPENAI_API_KEY;
    
    // Calls OpenAI API with GPT-4o model
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: model || "gpt-4o",
            messages: messages
        })
    });
});
```

### Frontend Integration
The AI Doctor page (`frontend/src/pages/AIDoctor.tsx`) is already configured to use this endpoint:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'https://plantoxy.onrender.com/api';

const response = await fetch(`${API_URL}/chat`, {
    method: "POST",
    body: JSON.stringify({
        model: "gpt-4o",
        messages: [...]
    })
});
```

---

## 🧪 Testing the AI Doctor

1. **Start the backend server:**
```bash
cd backend
npm start
```

2. **Start the frontend:**
```bash
cd frontend
npm run dev
```

3. **Navigate to the AI Doctor page:**
   - Open your browser to `http://localhost:5173`
   - Click on "Heaven" in the navigation
   - Select "AI Doctor"

4. **Test with a question:**
   - Type: "How do I care for a Monstera plant?"
   - The AI should respond with detailed plant care advice

---

## 🔍 Troubleshooting

### Issue: "API Key missing" error

**Solution:**
- Verify the `.env` file exists in the `backend` folder
- Check that `OPENAI_API_KEY` is set correctly
- Restart the backend server after updating `.env`

### Issue: "Network error" in frontend

**Solution:**
- Ensure the backend is running on port 5000
- Check the `VITE_API_URL` in `frontend/.env`:
  ```
  VITE_API_URL=http://localhost:5000/api
  ```
- Verify CORS is enabled in the backend

### Issue: "Rate limit exceeded"

**Solution:**
- OpenAI has usage limits on API keys
- Check your usage at: https://platform.openai.com/usage
- Consider upgrading your OpenAI plan if needed

---

## 📊 API Usage & Costs

### GPT-4o Pricing (as of 2024)
- **Input:** $5.00 / 1M tokens
- **Output:** $15.00 / 1M tokens

### Estimated Costs
- Average chat message: ~500 tokens
- Cost per message: ~$0.01
- 100 messages: ~$1.00

### Monitor Usage
- Dashboard: https://platform.openai.com/usage
- Set spending limits in your OpenAI account settings

---

## 🔐 Security Best Practices

1. **Never commit `.env` to Git:**
   - The `.gitignore` already excludes `.env`
   - Only commit `.env.example` as a template

2. **Rotate API keys regularly:**
   - Generate new keys every 90 days
   - Revoke old keys at: https://platform.openai.com/api-keys

3. **Use environment-specific keys:**
   - Development: Use a separate API key
   - Production: Use a different key with rate limits

---

## 🌟 Features Enabled

With OpenAI integration, the AI Doctor can now:

✅ **Answer plant care questions** with expert knowledge
✅ **Diagnose plant diseases** from descriptions
✅ **Provide personalized advice** based on climate data
✅ **Suggest treatments** for common plant problems
✅ **Explain botanical concepts** in simple terms
✅ **Recommend plants** for specific conditions

---

## 📝 Configuration Options

### Change the AI Model

Edit `frontend/src/pages/AIDoctor.tsx` line 115:

```typescript
model: "gpt-4o"  // Options: gpt-4o, gpt-4-turbo, gpt-3.5-turbo
```

### Adjust Response Length

Edit `backend/index.js` line 2166:

```javascript
max_tokens: 1000  // Increase for longer responses
```

### Modify Temperature (Creativity)

Edit `backend/index.js` line 2167:

```javascript
temperature: 0.7  // Range: 0.0 (focused) to 2.0 (creative)
```

---

## 🆘 Support

If you encounter any issues:

1. Check the backend console for error messages
2. Verify your OpenAI API key is valid
3. Ensure you have sufficient API credits
4. Review the browser console for frontend errors

For OpenAI-specific issues:
- Documentation: https://platform.openai.com/docs
- Status: https://status.openai.com
- Support: https://help.openai.com

---

## ✅ Verification Checklist

- [ ] `.env` file exists in `backend` folder
- [ ] `OPENAI_API_KEY` is set in `.env`
- [ ] Backend server is running (`npm start`)
- [ ] Frontend is running (`npm run dev`)
- [ ] AI Doctor page loads without errors
- [ ] Chat messages receive AI responses
- [ ] No console errors in browser or terminal

---

**🎉 Setup Complete!** Your AI Doctor is now powered by OpenAI GPT-4o.
