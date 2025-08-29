const mongoose = require('mongoose');

const AffirmationSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Affirmation text is required'],
    maxlength: [500, 'Affirmation cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: true,
    enum: [
      'self-love',
      'abundance',
      'health',
      'relationships',
      'career',
      'confidence',
      'healing',
      'manifestation',
      'gratitude',
      'peace',
      'success',
      'creativity'
    ]
  },
  tags: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient querying
AffirmationSchema.index({ category: 1, isActive: 1 });

module.exports = mongoose.model('Affirmation', AffirmationSchema);
