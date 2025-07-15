import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { FiCalendar, FiClock, FiMapPin, FiUsers, FiFilter, FiPlus } from 'react-icons/fi';
import axios from 'axios';

const Events = () => {
  const { isAuthenticated, user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, past
  const [category, setCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    total: 1,
    hasNext: false,
    hasPrev: false
  });

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'meeting', label: 'Meeting' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'social', label: 'Social' },
    { value: 'competition', label: 'Competition' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    fetchEvents();
  }, [filter, category, searchTerm, pagination.current]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.current,
        limit: 9
      });

      if (filter === 'upcoming') params.append('upcoming', 'true');
      if (filter === 'past') params.append('past', 'true');
      if (category) params.append('category', category);
      if (searchTerm) params.append('search', searchTerm);

      const response = await axios.get(`/api/events?${params}`);
      setEvents(response.data.events);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error('Failed to fetch events');
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAttend = async (eventId) => {
    try {
      await axios.post(`/api/events/${eventId}/attend`);
      toast.success('Successfully registered for event!');
      fetchEvents(); // Refresh events to update attendance
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register for event');
    }
  };

  const handleCancelAttendance = async (eventId) => {
    try {
      await axios.delete(`/api/events/${eventId}/attend`);
      toast.success('Successfully cancelled attendance');
      fetchEvents(); // Refresh events to update attendance
    } catch (error) {
      toast.error('Failed to cancel attendance');
    }
  };

  const isAttending = (event) => {
    return event.attendees?.some(attendee => attendee.user._id === user?.id);
  };

  const isEventPast = (event) => {
    return new Date(event.date) < new Date();
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, current: page }));
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, current: 1 }));
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Events</h1>
              <p className="text-gray-600">
                Discover and join exciting events in our community
              </p>
            </div>
            {isAuthenticated && (
              <Link
                to="/dashboard/create-event"
                className="btn btn-primary mt-4 md:mt-0"
              >
                <FiPlus className="mr-2" />
                Create Event
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Filter Tabs */}
            <div className="md:col-span-2">
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                {[
                  { value: 'all', label: 'All Events' },
                  { value: 'upcoming', label: 'Upcoming' },
                  { value: 'past', label: 'Past' }
                ].map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => handleFilterChange(tab.value)}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      filter === tab.value
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="form-input"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div>
              <form onSubmit={handleSearch} className="flex">
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input rounded-r-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors"
                >
                  <FiFilter />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {events.length === 0 ? (
          <div className="text-center py-12">
            <FiCalendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600">
              {filter === 'upcoming' 
                ? 'No upcoming events at the moment. Check back soon!'
                : filter === 'past'
                ? 'No past events to display.'
                : 'No events match your current filters.'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event._id} className="card hover:shadow-lg transition-shadow duration-300">
                {event.image && (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="card-body">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      event.category === 'workshop' ? 'bg-purple-100 text-purple-800' :
                      event.category === 'social' ? 'bg-green-100 text-green-800' :
                      event.category === 'competition' ? 'bg-red-100 text-red-800' :
                      event.category === 'meeting' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {event.category}
                    </span>
                    {isEventPast(event) && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">
                        Past
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {event.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <FiCalendar className="mr-2" />
                      {formatDate(event.date)}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <FiClock className="mr-2" />
                      {event.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <FiMapPin className="mr-2" />
                      {event.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <FiUsers className="mr-2" />
                      {event.attendees?.length || 0} attending
                      {event.maxAttendees > 0 && ` / ${event.maxAttendees}`}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/events/${event._id}`}
                      className="flex-1 btn btn-secondary text-center"
                    >
                      View Details
                    </Link>
                    
                    {isAuthenticated && !isEventPast(event) && (
                      isAttending(event) ? (
                        <button
                          onClick={() => handleCancelAttendance(event._id)}
                          className="btn btn-danger"
                        >
                          Cancel
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAttend(event._id)}
                          disabled={event.maxAttendees > 0 && event.attendees?.length >= event.maxAttendees}
                          className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {event.maxAttendees > 0 && event.attendees?.length >= event.maxAttendees 
                            ? 'Full' 
                            : 'Attend'
                          }
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.total > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.current - 1)}
                disabled={!pagination.hasPrev}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {[...Array(pagination.total)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    pagination.current === i + 1
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(pagination.current + 1)}
                disabled={!pagination.hasNext}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events; 