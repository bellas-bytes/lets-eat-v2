const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['document', 'video', 'link', 'image', 'other'],
    required: true
  },
  url: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number // in bytes
  },
  category: {
    type: String,
    enum: ['tutorial', 'guide', 'presentation', 'reference', 'other'],
    default: 'other'
  },
  tags: [{
    type: String,
    trim: true
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  thumbnail: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for search functionality
ResourceSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Resource', ResourceSchema); 