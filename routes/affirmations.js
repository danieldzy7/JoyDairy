const express = require('express');
const { body, validationResult } = require('express-validator');
const Affirmation = require('../models/Affirmation');
const UserAffirmation = require('../models/UserAffirmation');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/affirmations/daily
// @desc    Get daily affirmation for user
// @access  Private
router.get('/daily', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if user already has an affirmation for today
    let userAffirmation = await UserAffirmation.findOne({
      user: req.user.id,
      date: today
    }).populate('affirmation');

    if (!userAffirmation) {
      // Get a random affirmation for the user
      const affirmations = await Affirmation.find({ isActive: true });
      
      if (affirmations.length === 0) {
        return res.status(404).json({ message: 'No affirmations available' });
      }

      // Simple randomization (could be improved with user preferences)
      const randomIndex = Math.floor(Math.random() * affirmations.length);
      const selectedAffirmation = affirmations[randomIndex];

      // Create user affirmation record
      userAffirmation = new UserAffirmation({
        user: req.user.id,
        affirmation: selectedAffirmation._id,
        date: today
      });

      await userAffirmation.save();
      await userAffirmation.populate('affirmation');
    }

    res.json(userAffirmation);
  } catch (error) {
    console.error('Get daily affirmation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/affirmations/complete
// @desc    Mark daily affirmation as completed
// @access  Private
router.post('/complete', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { rating, personalizedText } = req.body;

    const userAffirmation = await UserAffirmation.findOne({
      user: req.user.id,
      date: today
    });

    if (!userAffirmation) {
      return res.status(404).json({ message: 'No affirmation found for today' });
    }

    userAffirmation.isCompleted = true;
    userAffirmation.completedAt = new Date();
    if (rating) userAffirmation.rating = rating;
    if (personalizedText) userAffirmation.personalizedText = personalizedText;

    await userAffirmation.save();
    res.json(userAffirmation);
  } catch (error) {
    console.error('Complete affirmation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/affirmations/history
// @desc    Get user's affirmation history
// @access  Private
router.get('/history', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const userAffirmations = await UserAffirmation.find({ user: req.user.id })
      .populate('affirmation')
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await UserAffirmation.countDocuments({ user: req.user.id });

    res.json({
      affirmations: userAffirmations,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get affirmation history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/affirmations/categories
// @desc    Get all affirmation categories
// @access  Private
router.get('/categories', auth, async (req, res) => {
  try {
    const categories = await Affirmation.distinct('category', { isActive: true });
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
