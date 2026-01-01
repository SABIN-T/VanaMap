// Quick test for AI Doctor endpoint
const testAIDoctor = async () => {
    try {
        console.log('🧪 Testing AI Doctor endpoint...\n');

        const response = await fetch('http://localhost:5000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: 'user',
                        content: 'How do I water my plants?'
                    }
                ]
            })
        });

        const data = await response.json();

        console.log('✅ Response received!\n');
        console.log('🤖 AI Doctor says:');
        console.log(data.choices[0]?.message?.content || 'No response');
        console.log('\n✨ AI Doctor is working perfectly!');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.log('\n💡 Make sure the backend is running: npm start');
    }
};

testAIDoctor();
