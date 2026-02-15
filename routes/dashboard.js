import express from 'express';
import User from '../models/User.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// GET /dashboard - Display dashboard
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      req.session.destroy();
      return res.redirect('/login');
    }

    res.render('dashboard', { user });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).render('error', { message: 'Error loading dashboard' });
  }
});

// GET /dashboard/profile - Display profile page
router.get('/profile', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    res.render('profile', { user });
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).render('error', { message: 'Error loading profile' });
  }
});

// POST /dashboard/update - Update student profile
router.post('/update', isAuthenticated, async (req, res) => {
  try {
    const { enrollmentNo, department, semester, cgpa } = req.body;

    if (!enrollmentNo || !department || !semester) {
      return res.status(400).json({ 
        success: false, 
        message: 'Required fields are missing' 
      });
    }

    await User.updateProfile(req.session.userId, enrollmentNo, department, semester, cgpa);

    res.json({ 
      success: true, 
      message: 'Profile updated successfully' 
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating profile' 
    });
  }
});

export default router;
