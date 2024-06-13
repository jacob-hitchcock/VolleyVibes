const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');

const adminMiddleware = async (req,res,next) => {
    const token = req.cookies.token;
    console.log('Token from cookie:',token); // Add this line for debugging

    if(!token) {
        console.log('No token found'); // Add this line for debugging
        return res.status(401).json({ message: 'Not authenticated' });
    }

    try {
        const decoded = jwt.verify(token,config.jwtSecret);
        console.log('Decoded token:',decoded); // Add this line for debugging

        const user = await User.findById(decoded.user.id);
        if(!user || user.role !== 'admin') {
            console.log('User not found or not admin'); // Add this line for debugging
            return res.status(403).json({ message: 'Forbidden: Admins only' });
        }

        req.user = user;
        next();
    } catch(error) {
        console.error('Admin middleware error:',error.message);
        res.status(403).json({ message: 'Forbidden: Admins only' });
    }
};

module.exports = adminMiddleware;
