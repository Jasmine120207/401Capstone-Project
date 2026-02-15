import express from 'express';
import User from '../models/User.js';
import { 
  validateEmail, 
  validatePassword, 
  hashPassword, 
  comparePasswords 
} from '../middleware/auth.js';

const router = express.Router();

// GET /auth/signup - Render signup page
router.get('/signup', (req, res) => {
  if (req.session.userId) {
    return res.redirect('/dashboard');
  }
  res.render('signup');
});

// POST /auth/signup - Handle signup
router.post('/signup', async (req, res) => {
  try {
    const { firstname, lastname, email, password, confirmPassword } = req.body;

    // Validation
    if (!firstname || !lastname || !email || !password || !confirmPassword) {
      return res.status(400).render('signup', { 
        error: 'All fields are required' 
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).render('signup', { 
        error: 'Please enter a valid email address' 
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).render('signup', { 
        error: 'Passwords do not match' 
      });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).render('signup', { 
        error: passwordValidation.message 
      });
    }

    // Check if email already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).render('signup', { 
        error: 'Email already registered. Please login or use a different email.' 
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    await User.create(firstname, lastname, email, hashedPassword);

    res.status(201).render('signup', { 
      success: 'Registration successful! Please login.' 
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).render('signup', { 
      error: 'An error occurred during registration. Please try again.' 
    });
  }
});

// GET /auth/login - Render login page
router.get('/login', (req, res) => {
  if (req.session.userId) {
    return res.redirect('/dashboard');
  }
  res.render('login');
});

// POST /auth/login - Handle login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).render('login', { 
        error: 'Email and password are required' 
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).render('login', { 
        error: 'Please enter a valid email address' 
      });
    }

    // Get password for comparison
    const user = await User.getPassword(email);
    if (!user) {
      return res.status(401).render('login', { 
        error: 'Invalid email or password' 
      });
    }

    // Compare passwords
    const passwordMatch = await comparePasswords(password, user.password);
    if (!passwordMatch) {
      return res.status(401).render('login', { 
        error: 'Invalid email or password' 
      });
    }

    // Set session
    req.session.userId = user.id;
    req.session.email = email;

    res.redirect('/dashboard');
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).render('login', { 
      error: 'An error occurred during login. Please try again.' 
    });
  }
});

// GET /auth/logout - Handle logout
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/');
  });
});

export default router;
