const mongoose = require('mongoose');

const TeamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    required: true,
    trim: true
  },
  bio: {
    type: String,
    required: true,
    maxlength: 500
  },
  avatar: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  socialLinks: {
    linkedin: String,
    twitter: String,
    github: String,
    website: String
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  department: {
    type: String,
    enum: ['leadership', 'technical', 'marketing', 'events', 'other'],
    default: 'other'
  },
  startDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TeamMember', TeamMemberSchema); 