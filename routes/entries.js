const express = require('express');
const { body, validationResult } = require('express-validator');
const Entry = require('../models/Entry');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/entries
// @desc    Get all entries for the authenticated user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const entries = await Entry.find({ user: req.user.id }).sort({ date: -1 });
    res.json(entries);
  } catch (error) {
    console.error('Get entries error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/entries/:date
// @desc    Get entry for a specific date
// @access  Private
router.get('/:date', auth, async (req, res) => {
  try {
    const { date } = req.params;
    const entry = await Entry.findOne({ 
      user: req.user.id, 
      date: new Date(date) 
    });
    
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found for this date' });
    }
    
    res.json(entry);
  } catch (error) {
    console.error('Get entry by date error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/entries
// @desc    Create or update an entry
// @access  Private
router.post('/', [
  auth,
  body('date', 'Date is required').isISO8601().toDate(),
  body('gratitude', 'Gratitude entry is required').not().isEmpty().trim().isLength({ max: 1000 }),
  body('manifestation', 'Manifestation entry is required').not().isEmpty().trim().isLength({ max: 1000 }),
  body('reflection', 'Reflection entry is required').not().isEmpty().trim().isLength({ max: 1000 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { date, gratitude, manifestation, reflection } = req.body;

    // Check if entry already exists for this date
    let entry = await Entry.findOne({ 
      user: req.user.id, 
      date: new Date(date) 
    });

    if (entry) {
      // Update existing entry
      entry.gratitude = gratitude;
      entry.manifestation = manifestation;
      entry.reflection = reflection;
      entry.updatedAt = Date.now();
    } else {
      // Create new entry
      entry = new Entry({
        user: req.user.id,
        date: new Date(date),
        gratitude,
        manifestation,
        reflection
      });
    }

    await entry.save();
    res.json(entry);
  } catch (error) {
    console.error('Create/Update entry error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Entry already exists for this date' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/entries/:date
// @desc    Delete an entry
// @access  Private
router.delete('/:date', auth, async (req, res) => {
  try {
    const { date } = req.params;
    const entry = await Entry.findOneAndDelete({ 
      user: req.user.id, 
      date: new Date(date) 
    });

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    res.json({ message: 'Entry deleted successfully' });
  } catch (error) {
    console.error('Delete entry error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
