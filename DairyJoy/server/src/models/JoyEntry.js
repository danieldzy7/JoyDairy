const mongoose = require('mongoose');

const JoyEntrySchema = new mongoose.Schema(
  {
    date: { type: String, required: true, index: true }, // YYYY-MM-DD
    owner: { type: String, default: 'me', index: true },
    joys: {
      type: [
        {
          text: { type: String, required: true, trim: true, maxlength: 500 },
          tag: { type: String, default: '' },
        },
      ],
      validate: (v) => Array.isArray(v) && v.length <= 5,
      default: [],
    },
    mood: { type: Number, min: 1, max: 5, default: 3 }, // 1 差 ~ 5 很好
    reflection: { type: String, default: '', maxlength: 2000 },
    gratitude: { type: String, default: '', maxlength: 1000 },
  },
  { timestamps: true }
);

JoyEntrySchema.index({ owner: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('JoyEntry', JoyEntrySchema);
