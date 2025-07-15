import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { FiUsers, FiMail, FiLinkedin, FiTwitter, FiGithub, FiGlobe } from 'react-icons/fi';
import axios from 'axios';

const Team = () => {
  const { isAuthenticated } = useAuth();
  const [teamMembers, setTeamMembers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState('');

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchTeamMembers();
  }, [selectedDepartment]);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('/api/team/departments');
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchTeamMembers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedDepartment) {
        params.append('department', selectedDepartment);
      }

      const response = await axios.get(`/api/team?${params}`);
      setTeamMembers(response.data);
    } catch (error) {
      toast.error('Failed to fetch team members');
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
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

  const getDepartmentIcon = (department) => {
    switch (department) {
      case 'leadership':
        return '👑';
      case 'technical':
        return '💻';
      case 'marketing':
        return '📢';
      case 'events':
        return '🎉';
      default:
        return '👥';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Meet the Team</h1>
              <p className="text-gray-600">
                Get to know the passionate individuals behind our community
              </p>
            </div>
            {isAuthenticated && (
              <button className="btn btn-primary mt-4 md:mt-0">
                <FiUsers className="mr-2" />
                Manage Team
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Department Filter */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedDepartment('')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedDepartment === ''
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Departments
            </button>
            {departments.map((department) => (
              <button
                key={department}
                onClick={() => setSelectedDepartment(department)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedDepartment === department
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {getDepartmentIcon(department)} {department.charAt(0).toUpperCase() + department.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Team Members Grid */}
        {teamMembers.length === 0 ? (
          <div className="text-center py-12">
            <FiUsers className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No team members found</h3>
            <p className="text-gray-600">
              {selectedDepartment 
                ? `No team members in the ${selectedDepartment} department.`
                : 'No team members to display.'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <div key={member._id} className="card hover:shadow-lg transition-shadow duration-300">
                <div className="card-body text-center">
                  {/* Avatar */}
                  <div className="mb-4">
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-gray-200"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-600">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Department Badge */}
                  <div className="mb-3">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getDepartmentColor(member.department)}`}>
                      {getDepartmentIcon(member.department)} {member.department.charAt(0).toUpperCase() + member.department.slice(1)}
                    </span>
                  </div>

                  {/* Name and Position */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-gray-600 mb-3">
                    {member.position}
                  </p>

                  {/* Bio */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {member.bio}
                  </p>

                  {/* Contact and Social Links */}
                  <div className="space-y-2">
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="flex items-center justify-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        <FiMail className="mr-2" />
                        {member.email}
                      </a>
                    )}

                    {/* Social Links */}
                    <div className="flex justify-center space-x-3">
                      {member.socialLinks?.linkedin && (
                        <a
                          href={member.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <FiLinkedin className="w-5 h-5" />
                        </a>
                      )}
                      {member.socialLinks?.twitter && (
                        <a
                          href={member.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-blue-400 transition-colors"
                        >
                          <FiTwitter className="w-5 h-5" />
                        </a>
                      )}
                      {member.socialLinks?.github && (
                        <a
                          href={member.socialLinks.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <FiGithub className="w-5 h-5" />
                        </a>
                      )}
                      {member.socialLinks?.website && (
                        <a
                          href={member.socialLinks.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-green-600 transition-colors"
                        >
                          <FiGlobe className="w-5 h-5" />
                        </a>
                      )}
                    </div>

                    {/* Start Date */}
                    <div className="text-xs text-gray-500 mt-3">
                      Member since {formatDate(member.startDate)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Team Stats */}
        {teamMembers.length > 0 && (
          <div className="mt-12 bg-white rounded-lg shadow-sm border p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Team Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{teamMembers.length}</div>
                <div className="text-gray-600">Total Members</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {departments.length}
                </div>
                <div className="text-gray-600">Departments</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {teamMembers.filter(m => m.department === 'leadership').length}
                </div>
                <div className="text-gray-600">Leadership</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {Math.round(teamMembers.reduce((acc, member) => {
                    const startDate = new Date(member.startDate);
                    const now = new Date();
                    return acc + (now - startDate) / (1000 * 60 * 60 * 24 * 365);
                  }, 0) / teamMembers.length * 10) / 10}
                </div>
                <div className="text-gray-600">Avg. Experience (Years)</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Team; 