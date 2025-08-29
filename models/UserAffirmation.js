const mongoose = require('mongoose');

const UserAffirmationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  affirmation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Affirmation',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  personalizedText: {
    type: String,
    maxlength: [500, 'Personalized text cannot exceed 500 characters']
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure one affirmation per user per date
UserAffirmationSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('UserAffirmation', UserAffirmationSchema);
