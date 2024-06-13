const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body,validationResult } = require('express-validator');
const User = require('../models/User'); // Adjust the path as necessary
const config = require('../config'); // Adjust the path as necessary

const router = express.Router();

router.get('/check-auth',(req,res) => {
    const token = req.cookies.token;
    console.log('Token from cookie in check-auth:',token); // Add this line for debugging

    if(!token) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    try {
        const decoded = jwt.verify(token,config.jwtSecret);
        console.log('Decoded token in check-auth:',decoded); // Add this line for debugging

        User.findById(decoded.user.id).then(user => {
            if(!user) {
                return res.status(401).json({ message: 'Not authenticated' });
            }
            res.json({ user: { id: user.id,email: user.email,role: user.role } });
        });
    } catch(error) {
        console.error('Token verification failed in check-auth:',error.message);
        res.status(401).json({ message: 'Not authenticated' });
    }
});

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
                        maxAge: 3600000
                    });

                    console.log('Generated token in login:',token); // Add this line for debugging

                    res.json({ message: 'Login successful',token }); // Return token in the response
                }
            );
        } catch(error) {
            console.error('Server error in login:',error);
            res.status(500).send('Server error');
        }
    }
);

router.post('/logout',(req,res) => {
    res.clearCookie('token');
    res.json({ message: 'Logout successful' });
});

module.exports = router;
