import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiBook, FiUsers, FiArrowRight, FiPlay, FiStar } from 'react-icons/fi';
import axios from 'axios';

const Home = () => {
  const [stats, setStats] = useState({
    events: 0,
    resources: 0,
    members: 0
  });
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, resourcesRes, teamRes] = await Promise.all([
          axios.get('/api/events?upcoming=true&limit=3'),
          axios.get('/api/resources?limit=6'),
          axios.get('/api/team')
        ]);

        setStats({
          events: eventsRes.data.events.length,
          resources: resourcesRes.data.resources.length,
          members: teamRes.data.length
        });

        setUpcomingEvents(eventsRes.data.events);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const features = [
    {
      icon: <FiCalendar className="w-8 h-8" />,
      title: 'Exciting Events',
      description: 'Join our diverse range of events from workshops to social gatherings.'
    },
    {
      icon: <FiBook className="w-8 h-8" />,
      title: 'Rich Resources',
      description: 'Access a curated collection of learning materials and tools.'
    },
    {
      icon: <FiUsers className="w-8 h-8" />,
      title: 'Amazing Team',
      description: 'Meet passionate individuals dedicated to building our community.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Member',
      content: 'This club has transformed my learning journey. The events and resources are incredible!',
      rating: 5
    },
    {
      name: 'Mike Chen',
      role: 'Member',
      content: 'Great community and amazing opportunities to connect with like-minded people.',
      rating: 5
    },
    {
      name: 'Emily Davis',
      role: 'Member',
      content: 'The resources here have helped me grow both personally and professionally.',
      rating: 5
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

    return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero min-h-screen bg-gradient-to-br from-primary via-primary-focus to-neutral">
        <div className="hero-overlay bg-opacity-0"></div>
        <div className="hero-content flex flex-col items-center justify-center w-full">
          <div className="max-w-2xl w-full text-center">
            <h1 className="mb-5 text-5xl font-bold">
              Welcome to Our
              <span className="block text-secondary">Club Community</span>
            </h1>
            <p className="mb-5">
              Connect, learn, and grow with passionate individuals. Join our vibrant community 
              where knowledge meets opportunity and friendships flourish.
            </p>
            <div className="stats shadow bg-base-200 mb-8">
              <div className="stat">
                <div className="stat-title text-secondary">Events</div>
                <div className="stat-value text-secondary">{stats.events}+</div>
              </div>
              <div className="stat">
                <div className="stat-title text-secondary">Resources</div>
                <div className="stat-value text-secondary">{stats.resources}+</div>
              </div>
              <div className="stat">
                <div className="stat-title text-secondary">Members</div>
                <div className="stat-value text-secondary">{stats.members}+</div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/events" className="btn btn-secondary">
                Explore Events
                <FiArrowRight className="ml-2" />
              </Link>
              <button className="btn btn-outline btn-accent">
                <FiPlay className="mr-2" />
                Watch Video
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-base-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Our Club?
            </h2>
            <p className="text-xl max-w-2xl mx-auto text-base-content/70">
              Discover what makes our community special and how we can help you grow.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card bg-base-200 hover:shadow-xl transition-all duration-300">
                <div className="card-body text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-base-content/70">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      {upcomingEvents.length > 0 && (
        <section className="py-20 bg-base-200">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Upcoming Events
                </h2>
                <p className="text-xl text-base-content/70">
                  Don't miss out on our exciting upcoming events
                </p>
              </div>
              <Link to="/events" className="btn btn-primary">
                View All Events
                <FiArrowRight className="ml-2" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <div key={event._id} className="card bg-base-100 hover:shadow-xl transition-shadow duration-300">
                  {event.image && (
                    <figure>
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-48 object-cover"
                      />
                    </figure>
                  )}
                  <div className="card-body">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="badge badge-primary">{event.category}</div>
                    </div>
                    <h3 className="card-title">{event.title}</h3>
                    <p className="text-base-content/70 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="card-actions justify-between text-sm text-base-content/60">
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                      <span>{event.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      <section className="py-20 bg-base-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Members Say
            </h2>
            <p className="text-xl max-w-2xl mx-auto text-base-content/70">
              Hear from our community members about their experiences.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card bg-base-200">
                <div className="card-body">
                  <div className="rating rating-md mb-4">
                    {[...Array(5)].map((_, i) => (
                      <input
                        key={i}
                        type="radio"
                        name={`rating-${index}`}
                        className="mask mask-star-2 bg-warning"
                        checked={i < testimonial.rating}
                        readOnly
                      />
                    ))}
                  </div>
                  <p className="text-base-content/70 italic">"{testimonial.content}"</p>
                  <div className="card-actions justify-end mt-4">
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-base-content/60">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="hero bg-primary text-primary-content py-20">
        <div className="hero-content flex flex-col items-center justify-center w-full">
          <div className="max-w-2xl w-full text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Join Our Community?
            </h2>
            <p className="mb-8">
              Connect with like-minded individuals, access exclusive resources, and participate 
              in amazing events. Start your journey with us today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/events" className="btn btn-secondary">
                Browse Events
              </Link>
              <Link to="/resources" className="btn btn-outline btn-accent">
                Explore Resources
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 