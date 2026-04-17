const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema(
  {
    owner: { type: String, default: 'me', index: true },
    role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
    content: { type: String, required: true },
    conversationId: { type: String, default: 'default', index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);
