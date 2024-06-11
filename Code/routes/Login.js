const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body,validationResult } = require('express-validator');
const User = require('../models/User'); // Adjust the path as necessary
const config = require('../config'); // Adjust the path as necessary

const router = express.Router();

console.log("Login route loaded");

router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Please enter a valid email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    ],
    async (req,res) => {
        console.log("Received login request");
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            console.log("Validation errors:",errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        const { email,password } = req.body;

        try {
            // Check if the user exists
            console.log("Finding user with email:",email);
            const user = await User.findOne({ email });
            if(!user) {
                console.log("User not found");
                return res.status(400).json({ message: 'Invalid email or password' });
            }

            // Compare the password with the hashed password in the database
            const isMatch = await bcrypt.compare(password,user.password);
            if(!isMatch) {
                console.log("Password does not match");
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
                    console.log("Token generated");
                    res.json({ token });
                }
            );
        } catch(error) {
            console.error("Server error:",error.message);
            res.status(500).send('Server error');
        }
    }
);

module.exports = router;