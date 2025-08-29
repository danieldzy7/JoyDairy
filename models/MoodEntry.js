const mongoose = require('mongoose');

const MoodEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  mood: {
    type: String,
    required: [true, 'Mood is required'],
    enum: [
      'excellent',    // 5 - Amazing, blissful, ecstatic
      'good',         // 4 - Happy, content, positive  
      'neutral',      // 3 - Okay, balanced, stable
      'low',          // 2 - Sad, tired, disappointed
      'terrible'      // 1 - Depressed, anxious, overwhelmed
    ]
  },
  moodScore: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  emotions: [{
    type: String,
    enum: [
      'happy', 'sad', 'angry', 'anxious', 'excited', 'calm', 'stressed',
      'peaceful', 'frustrated', 'grateful', 'worried', 'confident',
      'lonely', 'loved', 'motivated', 'tired', 'energetic', 'hopeful',
      'disappointed', 'proud', 'overwhelmed', 'relaxed', 'curious',
      'inspired', 'content', 'restless', 'focused', 'scattered'
    ]
  }],
  intensity: {
    type: Number,
    min: 1,
    max: 10,
    required: true
  },
  triggers: [{
    type: String,
    maxlength: [100, 'Trigger description cannot exceed 100 characters']
  }],
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  energyLevel: {
    type: Number,
    min: 1,
    max: 10
  },
  stressLevel: {
    type: Number,
    min: 1,
    max: 10
  },
  sleepQuality: {
    type: Number,
    min: 1,
    max: 10
  },
  timeOfDay: {
    type: String,
    enum: ['morning', 'afternoon', 'evening', 'night']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
MoodEntrySchema.pre('save', function(next) {
  if (!this.isNew) {
    this.updatedAt = Date.now();
  }
  next();
});

// Index for efficient querying
MoodEntrySchema.index({ user: 1, date: 1 });
MoodEntrySchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('MoodEntry', MoodEntrySchema);
