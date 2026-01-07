// MongoDB Error Handler - Convert Technical Errors to User-Friendly Messages
// Add this to backend/index.js

// ==========================================
// GLOBAL ERROR HANDLER MIDDLEWARE
// ==========================================

// Add this helper function at the top of your file (after imports)
const handleMongoError = (error) => {
    // MongoDB Duplicate Key Error (E11000)
    if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        const value = error.keyValue[field];

        switch (field) {
            case 'email':
                return {
                    status: 409,
                    error: "Email already in use",
                    message: "This email address is already associated with a VanaMap account.",
                    suggestion: "Try logging in instead, or use a different email address to create a new account.",
                    action: "login",
                    loginUrl: "/auth?mode=login",
                    field: "email"
                };

            case 'phone':
                return {
                    status: 409,
                    error: "Mobile number already registered",
                    message: "We found an existing account linked to this mobile number.",
                    suggestion: "Please log in to continue, or use a different mobile number to sign up.",
                    action: "login",
                    loginUrl: "/auth?mode=login",
                    field: "phone"
                };

            default:
                return {
                    status: 409,
                    error: "Account already exists",
                    message: "An account with this information already exists in our system.",
                    suggestion: "Please try logging in, or contact support if you need assistance.",
                    action: "login",
                    loginUrl: "/auth?mode=login"
                };
        }
    }

    // MongoDB Validation Error
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        return {
            status: 400,
            error: "Invalid information",
            message: messages.join('. '),
            suggestion: "Please check your information and try again.",
            action: "retry"
        };
    }

    // MongoDB Cast Error (Invalid ID format)
    if (error.name === 'CastError') {
        return {
            status: 400,
            error: "Invalid request",
            message: "The information you provided doesn't appear to be valid.",
            suggestion: "Please check your input and try again.",
            action: "retry"
        };
    }

    // Default error
    return {
        status: 500,
        error: "Something went wrong",
        message: "We're experiencing technical difficulties on our end.",
        suggestion: "Please try again in a few moments. If the problem persists, contact our support team.",
        action: "retry",
        supportEmail: "support@vanamap.online"
    };
};

// ==========================================
// WRAP ALL USER CREATION/UPDATE IN TRY-CATCH
// ==========================================

// Example: Update your signup/user creation endpoints like this:

app.post('/api/auth/verify-otp', async (req, res) => {
    try {
        const { registrationToken, otp } = req.body;

        // ... your existing OTP verification logic ...

        // When creating user, wrap in try-catch
        try {
            const user = new User({
                email: data.email,
                phone: data.phone,
                password: data.password,
                name: data.name,
                role: data.role,
                country: data.country,
                city: data.city,
                state: data.state,
                verified: true
            });
            await user.save();

            console.log(`[AUTH] User created: ${user.email || user.phone}`);

            // ... rest of your success logic ...

        } catch (saveError) {
            // Handle MongoDB errors professionally
            const errorResponse = handleMongoError(saveError);
            return res.status(errorResponse.status).json(errorResponse);
        }

    } catch (err) {
        res.status(500).json({
            error: "Verification failed",
            message: "We couldn't complete your verification at this time.",
            suggestion: "Please try again or contact support if the issue persists."
        });
    }
});

// ==========================================
// GLOBAL ERROR HANDLER (Add at the end, before app.listen)
// ==========================================

// Catch-all error handler
app.use((err, req, res, next) => {
    console.error('[ERROR]', err);

    // Handle MongoDB errors
    if (err.name === 'MongoError' || err.name === 'MongoServerError' || err.code === 11000) {
        const errorResponse = handleMongoError(err);
        return res.status(errorResponse.status).json(errorResponse);
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            error: "Authentication failed",
            message: "Your session has expired or is invalid.",
            suggestion: "Please log in again to continue.",
            action: "login"
        });
    }

    // Default error response
    res.status(500).json({
        error: "Something went wrong",
        message: "We're experiencing technical difficulties.",
        suggestion: "Please try again later or contact support.",
        supportEmail: "support@vanamap.online"
    });
});

// ==========================================
// EXAMPLE: Update All User Save Operations
// ==========================================

// Pattern to follow for ALL user.save() calls:

// ❌ BAD (Shows technical errors to users)
await user.save();

// ✅ GOOD (Handles errors professionally)
try {
    await user.save();
} catch (error) {
    const errorResponse = handleMongoError(error);
    return res.status(errorResponse.status).json(errorResponse);
}

// ==========================================
// QUICK FIX: Wrap Existing Endpoints
// ==========================================

// Find all places where you save users and wrap them:

// 1. Signup/Registration
app.post('/api/auth/signup', async (req, res) => {
    try {
        // ... validation logic ...

        const user = new User({ ...userData });

        try {
            await user.save();
            // Success logic
        } catch (saveError) {
            const errorResponse = handleMongoError(saveError);
            return res.status(errorResponse.status).json(errorResponse);
        }
    } catch (err) {
        res.status(500).json(handleMongoError(err));
    }
});

// 2. Profile Update
app.put('/api/user/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        // Update fields
        user.name = req.body.name;
        user.phone = req.body.phone;

        try {
            await user.save();
            res.json({ success: true, user });
        } catch (saveError) {
            const errorResponse = handleMongoError(saveError);
            return res.status(errorResponse.status).json(errorResponse);
        }
    } catch (err) {
        res.status(500).json(handleMongoError(err));
    }
});

// 3. Password Change
app.post('/api/user/change-password', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.password = req.body.newPassword;

        try {
            await user.save();
            res.json({ success: true });
        } catch (saveError) {
            const errorResponse = handleMongoError(saveError);
            return res.status(errorResponse.status).json(errorResponse);
        }
    } catch (err) {
        res.status(500).json(handleMongoError(err));
    }
});

// ==========================================
// TESTING
// ==========================================

// Test the error handler:
// 1. Try to create a user with existing email
// 2. Try to create a user with existing phone
// 3. Verify you see professional messages instead of MongoDB errors

// Expected response for duplicate phone:
/*
{
    "error": "Mobile number already registered",
    "message": "We found an existing account linked to this mobile number.",
    "suggestion": "Please log in to continue, or use a different mobile number to sign up.",
    "action": "login",
    "loginUrl": "/auth?mode=login",
    "field": "phone"
}
*/

// Instead of:
/*
{
    "error": "E11000 duplicate key error collection: test.users index: phone_1 dup key: { phone: \"9188773534\" }"
}
*/
