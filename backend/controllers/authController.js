// backend/controllers/authController.js

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @desc    Register new user
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const newUser = await User.create({ name, email, password });
    const token = generateToken(newUser._id);

    res.status(201).json({ token, user: { name: newUser.name, email: newUser.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id);
    res.status(200).json({ token, user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
