const express = require('express');
const { check, validationResult } = require('express-validator');
const Event = require('../models/Event');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET api/events
// @desc    Get all events (public)
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, upcoming, past, limit = 10, page = 1 } = req.query;
    
    let query = { isActive: true };
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Filter by date
    if (upcoming === 'true') {
      query.date = { $gte: new Date() };
    } else if (past === 'true') {
      query.date = { $lt: new Date() };
    }
    
    const events = await Event.find(query)
      .populate('createdBy', 'name avatar')
      .populate('attendees.user', 'name avatar')
      .sort({ date: 1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await Event.countDocuments(query);
    
    res.json({
      events,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        hasNext: parseInt(page) * parseInt(limit) < total,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/events/:id
// @desc    Get event by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'name avatar')
      .populate('attendees.user', 'name avatar');
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json(event);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/events
// @desc    Create a new event
// @access  Private
router.post('/', [
  auth,
  [
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('date', 'Date is required').isISO8601(),
    check('time', 'Time is required').not().isEmpty(),
    check('location', 'Location is required').not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const newEvent = new Event({
      ...req.body,
      createdBy: req.user.id
    });

    const event = await newEvent.save();
    await event.populate('createdBy', 'name avatar');
    
    res.json(event);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/events/:id
// @desc    Update an event
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if user is the creator or admin
    if (event.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('createdBy', 'name avatar');
    
    res.json(updatedEvent);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE api/events/:id
// @desc    Delete an event
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if user is the creator or admin
    if (event.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await event.remove();
    res.json({ message: 'Event removed' });
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/events/:id/attend
// @desc    Attend an event
// @access  Private
router.post('/:id/attend', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if event is in the past
    if (new Date(event.date) < new Date()) {
      return res.status(400).json({ message: 'Cannot attend past events' });
    }
    
    // Check if user is already attending
    const alreadyAttending = event.attendees.find(
      attendee => attendee.user.toString() === req.user.id
    );
    
    if (alreadyAttending) {
      return res.status(400).json({ message: 'Already attending this event' });
    }
    
    // Check if event is full
    if (event.maxAttendees > 0 && event.attendees.length >= event.maxAttendees) {
      return res.status(400).json({ message: 'Event is full' });
    }
    
    event.attendees.push({ user: req.user.id });
    await event.save();
    
    await event.populate('attendees.user', 'name avatar');
    res.json(event);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE api/events/:id/attend
// @desc    Cancel attendance
// @access  Private
router.delete('/:id/attend', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Remove user from attendees
    event.attendees = event.attendees.filter(
      attendee => attendee.user.toString() !== req.user.id
    );
    
    await event.save();
    await event.populate('attendees.user', 'name avatar');
    
    res.json(event);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 