const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret'); // Use the same secret used during token creation
        req.user = decoded; // Attach decoded payload to request object
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authMiddleware;
