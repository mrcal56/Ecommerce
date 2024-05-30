const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { protect, admin } = require('../middlewares/authMiddleware');
const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  console.log('Registering user:', { name, email, role });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists');
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({
      name,
      email,
      password,
      role: role || 'user',
    });

    const savedUser = await newUser.save();
    console.log('User registered:', savedUser);
    res.status(201).json(savedUser);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user', error });
  }
});

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Attempting login for:', email);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    console.log('Entered password:', password);
    console.log('Stored password:', user.password);
    console.log('Password match result:', isMatch);

    if (!isMatch) {
      console.log('Password does not match');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Login successful, token:', token);
    res.json({ token, role: user.role, email: user.email });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Error logging in', error });
  }
});

module.exports = router;
