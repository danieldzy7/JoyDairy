const express = require('express');
const { body, validationResult } = require('express-validator');
const MoodEntry = require('../models/MoodEntry');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/moods
// @desc    Create or update mood entry
// @access  Private
router.post('/', [
  auth,
  body('mood').isIn(['excellent', 'good', 'neutral', 'low', 'terrible']),
  body('moodScore').isInt({ min: 1, max: 5 }),
  body('intensity').isInt({ min: 1, max: 10 }),
  body('date').optional().isISO8601().toDate()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      mood,
      moodScore,
      emotions,
      intensity,
      triggers,
      notes,
      energyLevel,
      stressLevel,
      sleepQuality,
      timeOfDay,
      date
    } = req.body;

    const entryDate = date ? new Date(date) : new Date();
    entryDate.setHours(0, 0, 0, 0);

    // Check if mood entry already exists for this date
    let moodEntry = await MoodEntry.findOne({
      user: req.user.id,
      date: entryDate
    });

    if (moodEntry) {
      // Update existing entry
      moodEntry.mood = mood;
      moodEntry.moodScore = moodScore;
      moodEntry.emotions = emotions || [];
      moodEntry.intensity = intensity;
      moodEntry.triggers = triggers || [];
      moodEntry.notes = notes || '';
      moodEntry.energyLevel = energyLevel;
      moodEntry.stressLevel = stressLevel;
      moodEntry.sleepQuality = sleepQuality;
      moodEntry.timeOfDay = timeOfDay;
      moodEntry.updatedAt = Date.now();
    } else {
      // Create new entry
      moodEntry = new MoodEntry({
        user: req.user.id,
        date: entryDate,
        mood,
        moodScore,
        emotions: emotions || [],
        intensity,
        triggers: triggers || [],
        notes: notes || '',
        energyLevel,
        stressLevel,
        sleepQuality,
        timeOfDay
      });
    }

    await moodEntry.save();
    res.json(moodEntry);
  } catch (error) {
    console.error('Create/Update mood entry error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/moods
// @desc    Get user's mood entries
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 30, startDate, endDate } = req.query;
    
    let dateFilter = { user: req.user.id };
    
    if (startDate && endDate) {
      dateFilter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const moodEntries = await MoodEntry.find(dateFilter)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await MoodEntry.countDocuments(dateFilter);

    res.json({
      moods: moodEntries,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get mood entries error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/moods/:date
// @desc    Get mood entry for specific date
// @access  Private
router.get('/:date', auth, async (req, res) => {
  try {
    const { date } = req.params;
    const queryDate = new Date(date);
    queryDate.setHours(0, 0, 0, 0);

    const moodEntry = await MoodEntry.findOne({
      user: req.user.id,
      date: queryDate
    });

    if (!moodEntry) {
      return res.status(404).json({ message: 'No mood entry found for this date' });
    }

    res.json(moodEntry);
  } catch (error) {
    console.error('Get mood entry by date error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/moods/analytics/trends
// @desc    Get mood trends and analytics
// @access  Private
router.get('/analytics/trends', auth, async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const moodEntries = await MoodEntry.find({
      user: req.user.id,
      date: { $gte: startDate }
    }).sort({ date: 1 });

    // Calculate analytics
    const analytics = {
      totalEntries: moodEntries.length,
      averageMood: 0,
      averageEnergy: 0,
      averageStress: 0,
      moodDistribution: {
        excellent: 0,
        good: 0,
        neutral: 0,
        low: 0,
        terrible: 0
      },
      commonEmotions: {},
      moodTrend: []
    };

    if (moodEntries.length > 0) {
      let totalMoodScore = 0;
      let totalEnergy = 0;
      let totalStress = 0;
      let energyCount = 0;
      let stressCount = 0;

      moodEntries.forEach(entry => {
        totalMoodScore += entry.moodScore;
        analytics.moodDistribution[entry.mood]++;

        if (entry.energyLevel) {
          totalEnergy += entry.energyLevel;
          energyCount++;
        }

        if (entry.stressLevel) {
          totalStress += entry.stressLevel;
          stressCount++;
        }

        // Count emotions
        entry.emotions.forEach(emotion => {
          analytics.commonEmotions[emotion] = (analytics.commonEmotions[emotion] || 0) + 1;
        });

        // Add to mood trend
        analytics.moodTrend.push({
          date: entry.date,
          moodScore: entry.moodScore,
          mood: entry.mood
        });
      });

      analytics.averageMood = (totalMoodScore / moodEntries.length).toFixed(1);
      analytics.averageEnergy = energyCount > 0 ? (totalEnergy / energyCount).toFixed(1) : 0;
      analytics.averageStress = stressCount > 0 ? (totalStress / stressCount).toFixed(1) : 0;
    }

    res.json(analytics);
  } catch (error) {
    console.error('Get mood analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/moods/:date
// @desc    Delete mood entry
// @access  Private
router.delete('/:date', auth, async (req, res) => {
  try {
    const { date } = req.params;
    const queryDate = new Date(date);
    queryDate.setHours(0, 0, 0, 0);

    const moodEntry = await MoodEntry.findOneAndDelete({
      user: req.user.id,
      date: queryDate
    });

    if (!moodEntry) {
      return res.status(404).json({ message: 'No mood entry found for this date' });
    }

    res.json({ message: 'Mood entry deleted successfully' });
  } catch (error) {
    console.error('Delete mood entry error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
