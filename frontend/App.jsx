
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import StoryView from './pages/StoryView';
import StoryEditor from './pages/StoryEditor';
import Auth from './pages/Auth';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import ReaderDashboard from './pages/ReaderDashboard';
import Explore from './pages/Explore';
import Authors from './pages/Authors';
import AuthorProfile from './pages/AuthorProfile';
import { User, UserRole } from './types';
import { getCurrentUser, setCurrentUser, clearCurrentUser } from './services/authService';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    const loggedUser = getCurrentUser();
    if (loggedUser) setUser(loggedUser);
    setLoading(false);
  }, []);

  // Listen for storage changes to update user across tabs/components
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUser = getCurrentUser();
      setUser(updatedUser);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleAuthSuccess = (userData, token) => {
    setUser(userData);
    setCurrentUser(userData);
    localStorage.setItem('token', token);
  };

  const handleLogout = () => {
    setUser(null);
    clearCurrentUser();
  };

  if (loading) return null;

  return (
    <Router>
      <Layout user={user} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/story/:id" element={<StoryView />} />
          <Route path="/profile" element={<Profile user={user} onUserUpdate={setUser} />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/authors" element={<Authors user={user} />} />
          <Route path="/author/:authorId" element={<AuthorProfile user={user} />} />
          
          {/* Reader Dashboard */}
          <Route 
            path="/dashboard" 
            element={user ? <ReaderDashboard user={user} /> : <Navigate to="/auth" />} 
          />
          
          <Route 
            path="/login" 
            element={user ? <Navigate to="/" /> : <Auth type="login" onAuthSuccess={handleAuthSuccess} />} 
          />
          <Route 
            path="/register" 
            element={user ? <Navigate to="/" /> : <Auth type="register" onAuthSuccess={handleAuthSuccess} />} 
          />
          <Route 
            path="/auth" 
            element={user ? <Navigate to="/" /> : <Auth type="login" onAuthSuccess={handleAuthSuccess} />} 
          />

          {/* Protected Creator Routes */}
          <Route 
            path="/create" 
            element={user && (user.role === UserRole.AUTHOR || user.role === UserRole.ADMIN) ? <StoryEditor user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/edit/:id" 
            element={user && (user.role === UserRole.AUTHOR || user.role === UserRole.ADMIN) ? <StoryEditor user={user} /> : <Navigate to="/login" />} 
          />

          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={user && user.role === UserRole.ADMIN ? <AdminDashboard /> : <Navigate to="/" />} 
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
