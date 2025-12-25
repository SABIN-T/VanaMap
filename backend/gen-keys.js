const webpush = require('web-push');
const vapidKeys = webpush.generateVAPIDKeys();
const fs = require('fs');
fs.writeFileSync('keys.json', JSON.stringify(vapidKeys, null, 2));
