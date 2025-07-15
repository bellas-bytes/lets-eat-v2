const express = require('express');
const { check, validationResult } = require('express-validator');
const Resource = require('../models/Resource');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET api/resources
// @desc    Get all resources (public)
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, type, search, limit = 12, page = 1 } = req.query;
    
    let query = { isPublic: true };
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Filter by type
    if (type) {
      query.type = type;
    }
    
    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }
    
    const resources = await Resource.find(query)
      .populate('createdBy', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await Resource.countDocuments(query);
    
    res.json({
      resources,
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

// @route   GET api/resources/:id
// @desc    Get resource by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate('createdBy', 'name avatar');
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    // Increment download count
    resource.downloadCount += 1;
    await resource.save();
    
    res.json(resource);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/resources
// @desc    Create a new resource
// @access  Private
router.post('/', [
  auth,
  [
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('type', 'Type is required').isIn(['document', 'video', 'link', 'image', 'other']),
    check('url', 'URL is required').not().isEmpty(),
    check('category', 'Category is required').isIn(['tutorial', 'guide', 'presentation', 'reference', 'other'])
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const newResource = new Resource({
      ...req.body,
      createdBy: req.user.id
    });

    const resource = await newResource.save();
    await resource.populate('createdBy', 'name avatar');
    
    res.json(resource);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/resources/:id
// @desc    Update a resource
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    // Check if user is the creator or admin
    if (resource.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const updatedResource = await Resource.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('createdBy', 'name avatar');
    
    res.json(updatedResource);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE api/resources/:id
// @desc    Delete a resource
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    // Check if user is the creator or admin
    if (resource.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await resource.remove();
    res.json({ message: 'Resource removed' });
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/resources/categories
// @desc    Get all resource categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Resource.distinct('category');
    res.json(categories);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/resources/types
// @desc    Get all resource types
// @access  Public
router.get('/types', async (req, res) => {
  try {
    const types = await Resource.distinct('type');
    res.json(types);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 