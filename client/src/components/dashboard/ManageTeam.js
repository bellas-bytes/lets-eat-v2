import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FiUsers, FiPlus, FiEdit, FiTrash2, FiSave, FiX, FiMail, FiLinkedin, FiTwitter, FiGithub, FiGlobe } from 'react-icons/fi';
import axios from 'axios';

const ManageTeam = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    bio: '',
    email: '',
    department: 'other',
    avatar: '',
    socialLinks: {
      linkedin: '',
      twitter: '',
      github: '',
      website: ''
    },
    order: 0
  });

  const departments = [
    { value: 'leadership', label: 'Leadership' },
    { value: 'technical', label: 'Technical' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'events', label: 'Events' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/team');
      setTeamMembers(response.data);
    } catch (error) {
      toast.error('Failed to fetch team members');
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      position: '',
      bio: '',
      email: '',
      department: 'other',
      avatar: '',
      socialLinks: {
        linkedin: '',
        twitter: '',
        github: '',
        website: ''
      },
      order: 0
    });
    setEditingMember(null);
    setShowForm(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('social.')) {
      const socialKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialKey]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      position: member.position,
      bio: member.bio,
      email: member.email || '',
      department: member.department,
      avatar: member.avatar || '',
      socialLinks: {
        linkedin: member.socialLinks?.linkedin || '',
        twitter: member.socialLinks?.twitter || '',
        github: member.socialLinks?.github || '',
        website: member.socialLinks?.website || ''
      },
      order: member.order || 0
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingMember) {
        await axios.put(`/api/team/${editingMember._id}`, formData);
        toast.success('Team member updated successfully!');
      } else {
        await axios.post('/api/team', formData);
        toast.success('Team member added successfully!');
      }
      fetchTeamMembers();
      resetForm();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to save team member';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (memberId) => {
    if (window.confirm('Are you sure you want to remove this team member?')) {
      try {
        await axios.delete(`/api/team/${memberId}`);
        toast.success('Team member removed successfully!');
        fetchTeamMembers();
      } catch (error) {
        toast.error('Failed to remove team member');
      }
    }
  };

  const getDepartmentColor = (department) => {
    switch (department) {
      case 'leadership':
        return 'bg-blue-100 text-blue-800';
      case 'technical':
        return 'bg-green-100 text-green-800';
      case 'marketing':
        return 'bg-purple-100 text-purple-800';
      case 'events':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Team</h1>
              <p className="text-gray-600">
                Add, edit, and manage team member information
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary"
            >
              <FiPlus className="mr-2" />
              Add Member
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Team Members List */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="card-header">
                <h2 className="text-xl font-semibold text-gray-900">Team Members</h2>
              </div>
              <div className="card-body">
                {teamMembers.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No team members yet</p>
                ) : (
                  <div className="space-y-4">
                    {teamMembers.map((member) => (
                      <div key={member._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          {member.avatar ? (
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                              <span className="text-lg font-bold text-gray-600">
                                {member.name.charAt(0)}
                              </span>
                            </div>
                          )}
                          <div>
                            <h3 className="font-medium text-gray-900">{member.name}</h3>
                            <p className="text-sm text-gray-600">{member.position}</p>
                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getDepartmentColor(member.department)}`}>
                              {member.department}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit(member)}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <FiEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(member._id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Add/Edit Form */}
          {showForm && (
            <div className="lg:col-span-1">
              <div className="card">
                <div className="card-header">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {editingMember ? 'Edit Member' : 'Add Member'}
                    </h2>
                    <button
                      onClick={resetForm}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="form-label">Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>

                    {/* Position */}
                    <div>
                      <label htmlFor="position" className="form-label">Position *</label>
                      <input
                        type="text"
                        id="position"
                        name="position"
                        required
                        value={formData.position}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>

                    {/* Department */}
                    <div>
                      <label htmlFor="department" className="form-label">Department *</label>
                      <select
                        id="department"
                        name="department"
                        required
                        value={formData.department}
                        onChange={handleChange}
                        className="form-input"
                      >
                        {departments.map((dept) => (
                          <option key={dept.value} value={dept.value}>
                            {dept.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Bio */}
                    <div>
                      <label htmlFor="bio" className="form-label">Bio *</label>
                      <textarea
                        id="bio"
                        name="bio"
                        required
                        value={formData.bio}
                        onChange={handleChange}
                        className="form-input form-textarea"
                        rows={3}
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="form-label">Email</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiMail className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="form-input pl-10"
                        />
                      </div>
                    </div>

                    {/* Avatar URL */}
                    <div>
                      <label htmlFor="avatar" className="form-label">Avatar URL</label>
                      <input
                        type="url"
                        id="avatar"
                        name="avatar"
                        value={formData.avatar}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="https://example.com/avatar.jpg"
                      />
                    </div>

                    {/* Order */}
                    <div>
                      <label htmlFor="order" className="form-label">Display Order</label>
                      <input
                        type="number"
                        id="order"
                        name="order"
                        value={formData.order}
                        onChange={handleChange}
                        className="form-input"
                        min="0"
                      />
                    </div>

                    {/* Social Links */}
                    <div className="space-y-3">
                      <h3 className="font-medium text-gray-900">Social Links</h3>
                      
                      <div>
                        <label htmlFor="social.linkedin" className="form-label">LinkedIn</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiLinkedin className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            type="url"
                            id="social.linkedin"
                            name="social.linkedin"
                            value={formData.socialLinks.linkedin}
                            onChange={handleChange}
                            className="form-input pl-10"
                            placeholder="https://linkedin.com/in/username"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="social.twitter" className="form-label">Twitter</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiTwitter className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            type="url"
                            id="social.twitter"
                            name="social.twitter"
                            value={formData.socialLinks.twitter}
                            onChange={handleChange}
                            className="form-input pl-10"
                            placeholder="https://twitter.com/username"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="social.github" className="form-label">GitHub</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiGithub className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            type="url"
                            id="social.github"
                            name="social.github"
                            value={formData.socialLinks.github}
                            onChange={handleChange}
                            className="form-input pl-10"
                            placeholder="https://github.com/username"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="social.website" className="form-label">Website</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiGlobe className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            type="url"
                            id="social.website"
                            name="social.website"
                            value={formData.socialLinks.website}
                            onChange={handleChange}
                            className="form-input pl-10"
                            placeholder="https://example.com"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={resetForm}
                        className="flex-1 btn btn-secondary"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 btn btn-primary"
                      >
                        {loading ? (
                          <>
                            <div className="spinner mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <FiSave className="mr-2" />
                            {editingMember ? 'Update' : 'Add'} Member
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageTeam; 