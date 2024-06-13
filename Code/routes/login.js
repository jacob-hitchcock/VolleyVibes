const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body,validationResult } = require('express-validator');
const User = require('../models/User');
const config = require('../config');

const router = express.Router();

router.get('/check-auth',(req,res) => {
    const token = req.cookies.token;
    if(!token) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    try {
        const decoded = jwt.verify(token,config.jwtSecret);

        User.findById(decoded.user.id).then(user => {
            if(!user) {
                return res.status(401).json({ message: 'Not authenticated' });
            }
            res.json({ user: { id: user.id,email: user.email,role: user.role } });
        });
    } catch(error) {
        console.error('Token verification failed:',error.message);
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
            const user = await User.findOne({ email });
            if(!user) {
                return res.status(400).json({ message: 'Invalid email or password' });
            }

            const isMatch = await bcrypt.compare(password,user.password);
            if(!isMatch) {
                return res.status(400).json({ message: 'Invalid email or password' });
            }

            const payload = {
                user: {
                    id: user.id,
                    role: user.role,
                },
            };

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
                    });

                    res.json({ message: 'Login successful',token });
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

module.exports = router;
