/**
 * In-Memory Cache Configuration
 */
const NodeCache = require('node-cache');

const cache = new NodeCache({
    stdTTL: 300,        // 5 minutes default
    checkperiod: 60,    // Check for expired keys every 60 seconds
    useClones: false    // Better performance, don't clone objects
});

module.exports = { cache };
