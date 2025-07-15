const express = require('express');
const { check, validationResult } = require('express-validator');
const TeamMember = require('../models/TeamMember');
const { auth, admin } = require('../middleware/auth');

const router = express.Router();

// @route   GET api/team
// @desc    Get all team members (public)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { department } = req.query;
    
    let query = { isActive: true };
    
    // Filter by department
    if (department) {
      query.department = department;
    }
    
    const teamMembers = await TeamMember.find(query)
      .sort({ order: 1, name: 1 });
    
    res.json(teamMembers);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/team/:id
// @desc    Get team member by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);
    
    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    
    res.json(teamMember);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Team member not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/team
// @desc    Create a new team member
// @access  Private (Admin)
router.post('/', [
  auth,
  admin,
  [
    check('name', 'Name is required').not().isEmpty(),
    check('position', 'Position is required').not().isEmpty(),
    check('bio', 'Bio is required').not().isEmpty(),
    check('department', 'Department is required').isIn(['leadership', 'technical', 'marketing', 'events', 'other'])
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const newTeamMember = new TeamMember(req.body);
    const teamMember = await newTeamMember.save();
    
    res.json(teamMember);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/team/:id
// @desc    Update a team member
// @access  Private (Admin)
router.put('/:id', [auth, admin], async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);
    
    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    
    const updatedTeamMember = await TeamMember.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    res.json(updatedTeamMember);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Team member not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE api/team/:id
// @desc    Delete a team member
// @access  Private (Admin)
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);
    
    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    
    await teamMember.remove();
    res.json({ message: 'Team member removed' });
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Team member not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/team/departments
// @desc    Get all departments
// @access  Public
router.get('/departments', async (req, res) => {
  try {
    const departments = await TeamMember.distinct('department');
    res.json(departments);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 