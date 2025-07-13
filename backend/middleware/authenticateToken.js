const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const token = req.header('auth-token');
  if (!token) return res.status(401).send({ errors: "Please authenticate using valid token" });

  try {
    const data = jwt.verify(token, 'secret_ecom');
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ errors: "Please authenticate using valid token" });
  }
}

module.exports = authenticateToken;
