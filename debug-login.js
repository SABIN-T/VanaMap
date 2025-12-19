const https = require('https');

const testLogin = (email, password) => {
    const data = JSON.stringify({ email, password });

    const options = {
        hostname: 'plantoxy.onrender.com',
        port: 443,
        path: '/api/auth/login',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    console.log(`Testing login for: ${email} with pass: ${password}`);

    const req = https.request(options, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
            console.log(`Status: ${res.statusCode}`);
            console.log(`Body: ${body}\n`);
        });
    });

    req.on('error', error => {
        console.error(error);
    });

    req.write(data);
    req.end();
};

// Test 1: Exact credentials
testLogin('admin@plantai.com', 'Defender123');

// Test 2: Case variation
testLogin('Admin@PlantAI.com', 'Defender123');

// Test 3: Standard user check (if exists)
testLogin('test@example.com', 'password');

const checkHealth = () => {
    https.get('https://plantoxy.onrender.com/', (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
            console.log(`\nHealth Check Status: ${res.statusCode}`);
            console.log(`Health Check Body: ${body}`);
        });
    });
};

checkHealth();
