const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
require('dotenv').config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      statusCode: 401,
      error: 'Unauthorized',
    });
  }
  const token = authHeader && authHeader.split(' ')[1];
  jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({
        statusCode: 403,
        error: 'Forbidden',
      });
    }
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
