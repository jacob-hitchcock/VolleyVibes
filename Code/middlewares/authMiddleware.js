const jwt = require('jsonwebtoken');
const config = require('../config');

const authMiddleware = (req,res,next) => {
    const token = req.cookies.token;
    console.log('Token from cookie in authMiddleware:',token); // Add this line for debugging

    if(!token) {
        console.log('No token found in authMiddleware'); // Add this line for debugging
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token,config.jwtSecret);
        console.log('Decoded token in authMiddleware:',decoded); // Add this line for debugging
        req.user = decoded.user;
        next();
    } catch(error) {
        console.error('Token verification failed in authMiddleware:',error.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authMiddleware;
