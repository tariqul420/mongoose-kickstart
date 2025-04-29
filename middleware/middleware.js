const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const userSchema = require('../schemas/userSchema');

const User = mongoose.model('User', userSchema);

const verifyToken = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send({ error: 'Unauthorized access' });
  }

  // Verify Token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
    if (error) {
      return res.status(401).send({ error: 'Unauthorized access' });
    }

    req.user = decoded;
    next();
  });
};

const verifyAdmin = async (req, res, next) => {
  const email = req?.user?.email;
  if (!email) {
    return res.status(401).send({ error: 'Unauthorized access' });
  }

  try {
    const user = await User.findOne({ email });
    const isAdmin = user?.role === 'admin';

    if (!user || !isAdmin) {
      return res.status(403).send({ message: 'Forbidden access. Only admins have access!' });
    }

    next();
  } catch (err) {
    return res.status(500).send({ error: 'Server error', details: err.message });
  }
};

module.exports = { verifyToken, verifyAdmin };
