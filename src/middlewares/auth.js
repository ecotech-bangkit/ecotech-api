const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
require('dotenv').config();

const generateTokenPair = (user) => {
  const accessToken = jwt.sign({ id: user.id }, JWT_SECRET_KEY, { expiresIn: '7d' });
  const refreshToken = jwt.sign({ id: user.id }, JWT_SECRET_KEY, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};
const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded);
    });
  });
};
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      statusCode: 401,
      error: 'Unauthorized',
    });
  }
  const token = authHeader.split(' ')[1];

  try {
    const decoded = await verifyToken(token);
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    return res.status(403).json({
      statusCode: 403,
      error: 'Forbidden',
    });
  }
};

const authenticateRefreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({
      statusCode: 401,
      error: 'Unauthorized',
    });
  }

  try {
    const decoded = await verifyToken(refreshToken);
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    return res.status(403).json({
      statusCode: 403,
      error: 'Forbidden',
    });
  }
};

module.exports = {
  generateTokenPair,
  authenticateToken,
  authenticateRefreshToken,
};
