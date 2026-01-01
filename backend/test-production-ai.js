// Test the AI Doctor endpoint
const API_URL = 'https://plantoxy.onrender.com/api';

async function testAIDoctor() {
    console.log('🧪 Testing AI Doctor endpoint...\n');
    console.log(`📍 URL: ${API_URL}/chat\n`);

    try {
        const response = await fetch(`${API_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: 'user',
                        content: 'Hello, how do I water my plants?'
                    }
                ]
            })
        });

        console.log(`📊 Status: ${response.status} ${response.statusText}`);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Error Response:', errorText);
            return;
        }

        const data = await response.json();
        console.log('\n✅ Success! Response received:\n');
        console.log('🤖 AI Response:');
        console.log(data.choices[0]?.message?.content || 'No content');
        console.log('\n📊 Full Response Structure:');
        console.log(JSON.stringify(data, null, 2));

    } catch (error) {
        console.error('❌ Network Error:', error.message);
        console.log('\n💡 Possible issues:');
        console.log('   - Backend not deployed yet');
        console.log('   - CORS not configured');
        console.log('   - Network connectivity issue');
        console.log('   - Backend crashed');
    }
}

testAIDoctor();
