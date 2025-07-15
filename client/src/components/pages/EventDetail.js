import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { 
  FiCalendar, 
  FiClock, 
  FiMapPin, 
  FiUsers, 
  FiArrowLeft, 
  FiEdit, 
  FiTrash2,
  FiUser,
  FiCheck,
  FiX
} from 'react-icons/fi';
import axios from 'axios';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/events/${id}`);
      setEvent(response.data);
    } catch (error) {
      toast.error('Failed to fetch event details');
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAttend = async () => {
    try {
      await axios.post(`/api/events/${id}/attend`);
      toast.success('Successfully registered for event!');
      fetchEvent(); // Refresh event data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register for event');
    }
  };

  const handleCancelAttendance = async () => {
    try {
      await axios.delete(`/api/events/${id}/attend`);
      toast.success('Successfully cancelled attendance');
      fetchEvent(); // Refresh event data
    } catch (error) {
      toast.error('Failed to cancel attendance');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axios.delete(`/api/events/${id}`);
        toast.success('Event deleted successfully');
        navigate('/events');
      } catch (error) {
        toast.error('Failed to delete event');
      }
    }
  };

  const isAttending = () => {
    return event?.attendees?.some(attendee => attendee.user._id === user?.id);
  };

  const isEventPast = () => {
    return event && new Date(event.date) < new Date();
  };

  const isCreator = () => {
    return event?.createdBy?._id === user?.id;
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'workshop':
        return 'bg-purple-100 text-purple-800';
      case 'social':
        return 'bg-green-100 text-green-800';
      case 'competition':
        return 'bg-red-100 text-red-800';
      case 'meeting':
        return 'bg-blue-100 text-blue-800';
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

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
          <p className="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
          <Link to="/events" className="btn btn-primary">
            <FiArrowLeft className="mr-2" />
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/events"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FiArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
                <div className="flex items-center space-x-4 text-gray-600">
                  <span className="flex items-center">
                    <FiCalendar className="mr-1" />
                    {formatDate(event.date)}
                  </span>
                  <span className="flex items-center">
                    <FiClock className="mr-1" />
                    {event.time}
                  </span>
                </div>
              </div>
            </div>
            
            {(isCreator() || isAdmin()) && (
              <div className="flex items-center space-x-2">
                <Link
                  to={`/dashboard/edit-event/${event._id}`}
                  className="btn btn-secondary"
                >
                  <FiEdit className="mr-2" />
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  className="btn btn-danger"
                >
                  <FiTrash2 className="mr-2" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="card mb-8">
              {event.image && (
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-64 object-cover"
                />
              )}
              <div className="card-body">
                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getCategoryColor(event.category)}`}>
                    {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                  </span>
                  {isEventPast() && (
                    <span className="px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-800">
                      Past Event
                    </span>
                  )}
                </div>

                <p className="text-gray-700 leading-relaxed mb-6">
                  {event.description}
                </p>

                {event.tags && event.tags.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <FiCalendar className="w-5 h-5 mr-3" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FiClock className="w-5 h-5 mr-3" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FiMapPin className="w-5 h-5 mr-3" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FiUsers className="w-5 h-5 mr-3" />
                      <span>
                        {event.attendees?.length || 0} attending
                        {event.maxAttendees > 0 && ` / ${event.maxAttendees} max`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Attendees */}
            {event.attendees && event.attendees.length > 0 && (
              <div className="card">
                <div className="card-header">
                  <h2 className="text-xl font-semibold text-gray-900">Attendees</h2>
                </div>
                <div className="card-body">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {event.attendees.map((attendee) => (
                      <div key={attendee.user._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        {attendee.user.avatar ? (
                          <img
                            src={attendee.user.avatar}
                            alt={attendee.user.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              {attendee.user.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{attendee.user.name}</p>
                          <p className="text-sm text-gray-500">
                            Registered {new Date(attendee.registeredAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card sticky top-8">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Event Actions</h3>
              </div>
              <div className="card-body">
                {isAuthenticated ? (
                  <div className="space-y-4">
                    {!isEventPast() ? (
                      isAttending() ? (
                        <button
                          onClick={handleCancelAttendance}
                          className="w-full btn btn-danger"
                        >
                          <FiX className="mr-2" />
                          Cancel Attendance
                        </button>
                      ) : (
                        <button
                          onClick={handleAttend}
                          disabled={event.maxAttendees > 0 && event.attendees?.length >= event.maxAttendees}
                          className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FiCheck className="mr-2" />
                          {event.maxAttendees > 0 && event.attendees?.length >= event.maxAttendees 
                            ? 'Event Full' 
                            : 'Attend Event'
                          }
                        </button>
                      )
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-500">This event has already passed</p>
                      </div>
                    )}

                    <div className="border-t pt-4">
                      <h4 className="font-medium text-gray-900 mb-2">Event Status</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date:</span>
                          <span className="font-medium">{formatDate(event.date)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Time:</span>
                          <span className="font-medium">{event.time}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Location:</span>
                          <span className="font-medium">{event.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Attendees:</span>
                          <span className="font-medium">
                            {event.attendees?.length || 0}
                            {event.maxAttendees > 0 && ` / ${event.maxAttendees}`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {event.createdBy && (
                      <div className="border-t pt-4">
                        <h4 className="font-medium text-gray-900 mb-2">Organized by</h4>
                        <div className="flex items-center space-x-3">
                          {event.createdBy.avatar ? (
                            <img
                              src={event.createdBy.avatar}
                              alt={event.createdBy.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-gray-600">
                                {event.createdBy.name.charAt(0)}
                              </span>
                            </div>
                          )}
                          <span className="text-sm text-gray-700">{event.createdBy.name}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-600 mb-4">Sign in to attend this event</p>
                    <Link to="/login" className="btn btn-primary w-full">
                      Sign In
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail; 