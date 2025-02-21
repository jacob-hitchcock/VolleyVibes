const jwt = require('jsonwebtoken');
const config = require('../config');

const authMiddleware = (req,res,next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if(!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token,config.jwtSecret);
        req.user = decoded.user;
        next();
    } catch(error) {
        console.error('Token verification failed in authMiddleware:',error.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authMiddleware;