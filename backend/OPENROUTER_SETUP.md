# OpenRouter Integration for AI Doctor

In addition to Groq, VanaMap now supports **OpenRouter** as a fallback AI provider. This ensures Dr. Flora remains available even if the primary Groq API hits rate limits (429 errors).

## How it Works
1.  **Primary**: The system attempts to use **Groq** (Llama 3.2 Vision / Llama 3.3).
2.  **Fallback**: If Groq fails or is rate-limited, the system automatically switches to **OpenRouter**.
3.  **Models**:
    *   **Vision/Text**: `google/gemini-2.0-flash-exp:free` (Multimodal, high speed, free).
    *   **Text Fallback**: `meta-llama/llama-3-8b-instruct:free`.

## Setup
### 1. Get API Key
*   Go to [OpenRouter.ai](https://openrouter.ai/).
*   Sign up/Login.
*   Create a new API Key.

### 2. Configure Environment
Add the key to your `.env` file in the `backend/` directory:

```env
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. Deployment (Render)
*   Go to your Render Dashboard.
*   Select the Backend Service.
*   Go to **Environment**.
*   Add Environment Variable:
    *   Key: `OPENROUTER_API_KEY`
    *   Value: `sk-or-v1-xxxxxxxx...`

## Verification
You can use the included test script to verify the connection:
```bash
cd backend
node test-openrouter.js
```
