const jwt = require('jsonwebtoken');
const config = require('../config');

const authMiddleware = (req,res,next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    console.log('Token from cookie or header in authMiddleware:',token);

    if(!token) {
        console.log('No token found in authMiddleware');
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token,config.jwtSecret);
        console.log('Decoded token in authMiddleware:',decoded);
        req.user = decoded.user;
        next();
    } catch(error) {
        console.error('Token verification failed in authMiddleware:',error.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authMiddleware;
