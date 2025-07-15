import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './components/pages/Home';
import Events from './components/pages/Events';
import EventDetail from './components/pages/EventDetail';
import Resources from './components/pages/Resources';
import ResourceDetail from './components/pages/ResourceDetail';
import Team from './components/pages/Team';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import CreateEvent from './components/dashboard/CreateEvent';
import CreateResource from './components/dashboard/CreateResource';
import ManageTeam from './components/dashboard/ManageTeam';
import LoadingSpinner from './components/common/LoadingSpinner';

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="App" data-theme="club">
      <Navbar />
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/resources/:id" element={<ResourceDetail />} />
          <Route path="/team" element={<Team />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/dashboard/create-event" 
            element={isAuthenticated ? <CreateEvent /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/dashboard/create-resource" 
            element={isAuthenticated ? <CreateResource /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/dashboard/manage-team" 
            element={isAuthenticated ? <ManageTeam /> : <Navigate to="/login" />} 
          />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App; 