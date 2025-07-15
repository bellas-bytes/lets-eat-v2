import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { 
  FiCalendar, 
  FiBook, 
  FiUsers, 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiEye,
  FiTrendingUp,
  FiActivity
} from 'react-icons/fi';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    events: { total: 0, upcoming: 0, past: 0 },
    resources: { total: 0, downloads: 0 },
    team: { total: 0, departments: 0 }
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [recentResources, setRecentResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [eventsRes, resourcesRes, teamRes] = await Promise.all([
        axios.get('/api/events?limit=5'),
        axios.get('/api/resources?limit=5'),
        axios.get('/api/team')
      ]);

      // Calculate stats
      const events = eventsRes.data.events;
      const resources = resourcesRes.data.resources;
      const teamMembers = teamRes.data;

      setStats({
        events: {
          total: events.length,
          upcoming: events.filter(e => new Date(e.date) > new Date()).length,
          past: events.filter(e => new Date(e.date) < new Date()).length
        },
        resources: {
          total: resources.length,
          downloads: resources.reduce((acc, r) => acc + (r.downloadCount || 0), 0)
        },
        team: {
          total: teamMembers.length,
          departments: [...new Set(teamMembers.map(m => m.department))].length
        }
      });

      setRecentEvents(events.slice(0, 3));
      setRecentResources(resources.slice(0, 3));
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axios.delete(`/api/events/${eventId}`);
        toast.success('Event deleted successfully');
        fetchDashboardData();
      } catch (error) {
        toast.error('Failed to delete event');
      }
    }
  };

  const handleDeleteResource = async (resourceId) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await axios.delete(`/api/resources/${resourceId}`);
        toast.success('Resource deleted successfully');
        fetchDashboardData();
      } catch (error) {
        toast.error('Failed to delete resource');
      }
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
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
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">
              Welcome back, {user?.name}! Here's what's happening in your club.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="card-body">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FiCalendar className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Events</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.events.total}</p>
                </div>
              </div>
              <div className="mt-4 flex space-x-2 text-sm">
                <span className="text-green-600">{stats.events.upcoming} upcoming</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">{stats.events.past} past</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FiBook className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Resources</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.resources.total}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600">{stats.resources.downloads} total downloads</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FiUsers className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Team Members</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.team.total}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600">{stats.team.departments} departments</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <FiActivity className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Activity</p>
                  <p className="text-2xl font-bold text-gray-900">Active</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600">Community thriving</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/dashboard/create-event"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <FiPlus className="w-6 h-6 text-blue-600 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900">Create Event</h3>
                <p className="text-sm text-gray-600">Schedule a new club event</p>
              </div>
            </Link>

            <Link
              to="/dashboard/create-resource"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
            >
              <FiBook className="w-6 h-6 text-green-600 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900">Add Resource</h3>
                <p className="text-sm text-gray-600">Share new learning materials</p>
              </div>
            </Link>

            <Link
              to="/dashboard/manage-team"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
            >
              <FiUsers className="w-6 h-6 text-purple-600 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900">Manage Team</h3>
                <p className="text-sm text-gray-600">Update team information</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Events */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Recent Events</h2>
                <Link
                  to="/events"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="card-body">
              {recentEvents.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No events yet</p>
              ) : (
                <div className="space-y-4">
                  {recentEvents.map((event) => (
                    <div key={event._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{event.title}</h3>
                        <p className="text-sm text-gray-600">{formatDate(event.date)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/events/${event._id}`}
                          className="p-1 text-gray-400 hover:text-blue-600"
                        >
                          <FiEye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/dashboard/edit-event/${event._id}`}
                          className="p-1 text-gray-400 hover:text-green-600"
                        >
                          <FiEdit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteEvent(event._id)}
                          className="p-1 text-gray-400 hover:text-red-600"
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

          {/* Recent Resources */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Recent Resources</h2>
                <Link
                  to="/resources"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="card-body">
              {recentResources.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No resources yet</p>
              ) : (
                <div className="space-y-4">
                  {recentResources.map((resource) => (
                    <div key={resource._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{resource.title}</h3>
                        <p className="text-sm text-gray-600">{resource.downloadCount || 0} downloads</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/resources/${resource._id}`}
                          className="p-1 text-gray-400 hover:text-blue-600"
                        >
                          <FiEye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/dashboard/edit-resource/${resource._id}`}
                          className="p-1 text-gray-400 hover:text-green-600"
                        >
                          <FiEdit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteResource(resource._id)}
                          className="p-1 text-gray-400 hover:text-red-600"
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
      </div>
    </div>
  );
};

export default Dashboard; 