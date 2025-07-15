const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['meeting', 'workshop', 'social', 'competition', 'other'],
    default: 'other'
  },
  maxAttendees: {
    type: Number,
    default: 0 // 0 means unlimited
  },
  attendees: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    registeredAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Virtual for checking if event is in the past
EventSchema.virtual('isPast').get(function() {
  return new Date(this.date) < new Date();
});

// Virtual for checking if event is upcoming
EventSchema.virtual('isUpcoming').get(function() {
  return new Date(this.date) > new Date();
});

// Ensure virtuals are serialized
EventSchema.set('toJSON', { virtuals: true });
EventSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Event', EventSchema); 