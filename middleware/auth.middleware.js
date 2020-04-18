const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    // get token from headers
    const token = req.headers.authorization.split(' ')[1];
    // if no token
    if (!token) {
      return res.status(401).json({ message: 'Пользователь не авторизован' });
    }
    // decode token
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    // 
    req.user = decoded;
    next();
    
  } catch (err) {
    return res.status(401).json({ message: 'Пользователь не авторизован' });
  }
}
