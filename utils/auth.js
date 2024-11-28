const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const generateToken = (user) => {
  const payload = {
    sub: user.username,
    id_user: user.id,
    roles: user.role.roleName
  };
  console.log('JWT payload:', payload);
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const comparePassword = (password, hash) => {
  return bcrypt.compare(password, hash);
};

module.exports = { generateToken, hashPassword, comparePassword };
