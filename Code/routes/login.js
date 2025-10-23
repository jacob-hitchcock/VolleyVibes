const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body,validationResult } = require('express-validator');
const User = require('../models/User');
const config = require('../config');
const authMiddleware = require('../middlewares/authMiddleware'); // Import the auth middleware

const router = express.Router();

router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Please enter a valid email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    ],
    async (req,res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email,password } = req.body;

        try {
            // Check if the user exists
            const user = await User.findOne({ email });
            if(!user) {
                return res.status(400).json({ message: 'Invalid email or password' });
            }

            // Compare the password with the hashed password in the database
            const isMatch = await bcrypt.compare(password,user.password);
            if(!isMatch) {
                return res.status(400).json({ message: 'Invalid email or password' });
            }

            // Create a JWT payload
            const payload = {
                user: {
                    id: user.id,
                    role: user.role,
                },
            };

            // Sign the token
            jwt.sign(
                payload,
                config.jwtSecret,
                { expiresIn: config.jwtExpiresIn },
                (err,token) => {
                    if(err) throw err;
                    res.cookie('token',token,{
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'strict',
                        maxAge: 3600000,
                        path: '/'
                    });

                    res.json({ message: 'Login successful',user: { id: user.id,email: user.email,role: user.role },token });
                }
            );
        } catch(error) {
            console.error('Server error:',error);
            res.status(500).send('Server error');
        }
    }
);

router.post('/logout',(req,res) => {
    res.clearCookie('token');
    res.json({ message: 'Logout successful' });
});

// Add the /me route here
router.get('/me',authMiddleware,async (req,res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json({ user });
    } catch(error) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
