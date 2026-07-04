/**
 * Authentication Middleware
 * Handles JWT verification for protected routes
 */
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.error("FATAL: JWT_SECRET not found in environment variables.");
    process.exit(1);
}

/**
 * Required authentication — rejects unauthenticated requests
 */
const auth = (req, res, next) => {
    let token = req.header('Authorization')?.replace('Bearer ', '');

    // Fallback to query parameters if header is missing
    if (!token && req.query && req.query.token) {
        token = req.query.token;
    }

    // Fallback to cookie if header and query are missing
    if (!token && req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).json({ error: 'Invalid token.' });
    }
};

/**
 * Admin role check — must be used after auth middleware
 */
const admin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Admin only.' });
    }
    next();
};

/**
 * Optional auth — allows unauthenticated access but attaches user if token exists
 */
const optionalAuth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        req.user = null;
        return next();
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (ex) {
        req.user = null;
        next();
    }
};

/**
 * Helper to normalize user for frontend (stripping sensitive data)
 */
const normalizeUser = (user) => {
    if (!user) return null;
    const obj = user.toObject ? user.toObject() : user;
    const { password, __v, _id, ...rest } = obj;
    return {
        id: _id ? _id.toString() : (obj.id || ''),
        ...rest
    };
};

/**
 * Developer API key validation
 */
const requireApiKey = async (req, res, next) => {
    const { ApiKey } = require('../models');
    const key = req.header('x-api-key');
    if (!key) return res.status(401).json({ error: "Missing x-api-key header" });

    try {
        const apiKeyDoc = await ApiKey.findOne({ key, isActive: true });
        if (!apiKeyDoc) return res.status(403).json({ error: "Invalid or revoked API Key" });

        // Update usage stats (async, don't block)
        apiKeyDoc.lastUsed = new Date();
        apiKeyDoc.save();

        req.apiKey = apiKeyDoc;
        next();
    } catch (e) {
        res.status(500).json({ error: "API Validation Error" });
    }
};

/**
 * Generic validation handler for express-validator
 */
const { validationResult } = require('express-validator');
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: "Validation failed",
            details: errors.array().map(e => ({ field: e.path, message: e.msg }))
        });
    }
    next();
};

module.exports = { auth, admin, optionalAuth, normalizeUser, requireApiKey, validateRequest, JWT_SECRET };
