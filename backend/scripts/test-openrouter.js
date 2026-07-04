require('dotenv').config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
    console.error("❌ Error: OPENROUTER_API_KEY is not set in .env file.");
    process.exit(1);
}

const testOpenRouter = async () => {
    console.log("🔄 Testing OpenRouter Connection...");
    console.log("key", OPENROUTER_API_KEY)

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "HTTP-Referer": "https://vanamap.online",
                "X-Title": "VanaMap Test Script"
            },
            body: JSON.stringify({
                model: "google/gemini-2.0-flash-exp:free",
                messages: [
                    { role: "user", content: "Hello! Are you working? Reply with 'Yes, I am fully operational via OpenRouter!'" }
                ]
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log("\n✅ SUCCESS: OpenRouter Responded!");
            console.log("------------------------------------------------");
            console.log("Model:", data.model);
            console.log("Response:", data.choices[0].message.content);
            console.log("------------------------------------------------");
        } else {
            console.error("\n❌ FAILED: OpenRouter Error");
            console.error(data);
        }

    } catch (error) {
        console.error("\n❌ CRITICAL ERROR:", error.message);
    }
};

testOpenRouter();
