const User = require('../models/User');
const Role = require('../models/Role');
const { generateToken, hashPassword, comparePassword } = require('../utils/auth');
const { ValidationError } = require('sequelize');

const register = async (req, res) => {
  console.log('Register endpoint hit');
  try {
    const { username, password, firstname, lastname } = req.body;
    console.log('Request body:', req.body);

    const hashedPassword = await hashPassword(password);
    console.log('Hashed password:', hashedPassword);

    const role = await Role.findOne({ where: { roleName: 'TIENDA' } });
    console.log('Role found:', role);

    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }

    let user = await User.create({
      username,
      password: hashedPassword,
      firstname,
      lastname,
      roleId: role.id
    });
    console.log('User created:', user);

    // Recuperar el usuario con la relación Role
    user = await User.findByPk(user.id, { include: 'role' });
    console.log('User with role:', user);

    const token = generateToken(user);
    console.log('Generated token:', token);

    res.json({ token });
  } catch (error) {
    console.error('Error during registration:', error);
    if (error instanceof ValidationError) {
      return res.status(400).json({ error: error.errors.map(e => e.message) });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

const login = async (req, res) => {
  console.log('Login endpoint hit');
  try {
    const { username, password } = req.body;
    console.log('Request body:', req.body);

    const user = await User.findOne({ where: { username }, include: 'role' });
    console.log('User found:', user);

    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = generateToken(user);
    console.log('Generated token:', token);

    res.json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { register, login };
