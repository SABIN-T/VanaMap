require('dotenv').config();

console.log('🧪 Testing FREE Groq API Integration...\n');

// Check if API key is loaded (optional)
const apiKey = process.env.GROQ_API_KEY || 'GROQ_KEY_demo_key_for_testing';

console.log('✅ Using Groq API');
console.log(`📊 Mode: ${process.env.GROQ_API_KEY ? 'Personal API Key' : 'Demo Mode'}\n`);

// Test API call
async function testGroq() {
    try {
        console.log('🔄 Sending test request to Groq (FREE API)...');
        const startTime = Date.now();

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'llama-3.1-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: 'You are Dr. Flora, a friendly plant expert.'
                    },
                    {
                        role: 'user',
                        content: 'Say hello and introduce yourself in one sentence.'
                    }
                ],
                max_tokens: 100,
                temperature: 0.7
            })
        });

        const endTime = Date.now();
        const responseTime = endTime - startTime;

        const data = await response.json();

        if (!response.ok) {
            console.error('❌ API Error:', data.error?.message || 'Unknown error');
            console.log('\n🔍 Full Response:', JSON.stringify(data, null, 2));

            if (data.error?.message?.includes('rate_limit')) {
                console.log('\n💡 Rate limit hit - This is normal for demo mode');
                console.log('   Get your own FREE key at: https://console.groq.com');
                console.log('   Or wait 1 minute and try again');
            }

            console.log('\n🛡️ Fallback system will handle this automatically in production');
            process.exit(1);
        }

        const aiResponse = data.choices[0]?.message?.content;

        console.log('✅ Groq API is working!\n');
        console.log('🤖 AI Response:', aiResponse);
        console.log('\n📊 Performance:');
        console.log(`   - Response time: ${responseTime}ms`);
        console.log(`   - Model: ${data.model}`);
        console.log(`   - Tokens used: ${data.usage?.total_tokens || 'N/A'}`);

        console.log('\n✨ SUCCESS! Your AI Doctor is ready to use (FREE).');
        console.log('🚀 Start your backend with: npm start');
        console.log('\n💡 Tip: Get your own API key for better rate limits:');
        console.log('   https://console.groq.com (free, no credit card)');

    } catch (error) {
        console.error('❌ Network Error:', error.message);
        console.log('\n🔍 Troubleshooting:');
        console.log('   1. Check your internet connection');
        console.log('   2. Verify Groq status: https://status.groq.com');
        console.log('   3. Try again in a few seconds');
        console.log('\n🛡️ Don\'t worry - the fallback system will handle errors automatically');
        process.exit(1);
    }
}

testGroq();
