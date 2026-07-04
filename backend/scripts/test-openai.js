require('dotenv').config();

console.log('🧪 Testing OpenAI API Integration...\n');

// Check if API key is loaded
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
    console.error('❌ ERROR: OPENAI_API_KEY not found in .env file');
    console.log('\n📝 Please run: setup-openai.bat');
    process.exit(1);
}

console.log('✅ API Key loaded successfully');
console.log(`📊 Key preview: ${apiKey.substring(0, 5)}...`);

// Test API call
async function testOpenAI() {
    try {
        console.log('🔄 Sending test request to OpenAI...');

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: 'You are Dr. Flora, a friendly plant expert.'
                    },
                    {
                        role: 'user',
                        content: 'Say hello in one sentence.'
                    }
                ],
                max_tokens: 50
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('❌ API Error:', data.error?.message || 'Unknown error');
            console.log('\n🔍 Response:', JSON.stringify(data, null, 2));
            process.exit(1);
        }

        const aiResponse = data.choices[0]?.message?.content;

        console.log('✅ OpenAI API is working!\n');
        console.log('🤖 AI Response:', aiResponse);
        console.log('\n📊 Usage:');
        console.log(`   - Prompt tokens: ${data.usage.prompt_tokens}`);
        console.log(`   - Completion tokens: ${data.usage.completion_tokens}`);
        console.log(`   - Total tokens: ${data.usage.total_tokens}`);
        console.log(`   - Model: ${data.model}`);

        console.log('\n✨ SUCCESS! Your AI Doctor is ready to use.');
        console.log('🚀 Start your backend with: npm start');

    } catch (error) {
        console.error('❌ Network Error:', error.message);
        console.log('\n🔍 Troubleshooting:');
        console.log('   1. Check your internet connection');
        console.log('   2. Verify your OpenAI API key is valid');
        console.log('   3. Check OpenAI status: https://status.openai.com');
        process.exit(1);
    }
}

testOpenAI();
