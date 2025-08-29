const mongoose = require('mongoose');

const EntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  gratitude: {
    type: String,
    required: [true, 'Gratitude entry is required'],
    maxlength: [1000, 'Gratitude entry cannot exceed 1000 characters']
  },
  manifestation: {
    type: String,
    required: [true, 'Manifestation entry is required'],
    maxlength: [1000, 'Manifestation entry cannot exceed 1000 characters']
  },
  reflection: {
    type: String,
    required: [true, 'Reflection entry is required'],
    maxlength: [1000, 'Reflection entry cannot exceed 1000 characters']
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
EntrySchema.pre('save', function(next) {
  if (!this.isNew) {
    this.updatedAt = Date.now();
  }
  next();
});

// Ensure one entry per user per date
EntrySchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Entry', EntrySchema);
