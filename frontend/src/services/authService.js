import { UserRole } from '../types';
import { getDb, saveDb } from './mockDb';

// Use environment variable for API URL in production, fallback to production URL
const API_URL = import.meta.env.VITE_API_URL || 'https://storyconnect-backend.onrender.com/api';

// Check if backend is available
const isBackendAvailable = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout
    
    const response = await fetch(`${API_URL}/test`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    // Check if it's actually our API (returns JSON)
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return false;
    }
    
    return response.ok;
  } catch {
    return false;
  }
};

// Upload avatar to server
export const uploadAvatar = async (file) => {
  try {
    const backendAvailable = await isBackendAvailable();
    if (backendAvailable) {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await fetch(`${API_URL}/upload/avatar`, {
        method: 'POST',
        body: formData
      });
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server not available');
      }
      
      if (!response.ok) {
        throw new Error('Failed to upload avatar');
      }
      
      const data = await response.json();
      return data.url;
    }
  } catch (error) {
    console.log('Avatar upload fallback to base64:', error);
  }
  
  // Fallback: convert to base64 for local storage
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(file);
  });
};

export const login = async (email, password) => {
  // Try backend first
  try {
    const backendAvailable = await isBackendAvailable();
    if (backendAvailable) {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }
      
      const data = await response.json();
      return {
        user: {
          id: data.user.id,
          username: data.user.username,
          email: data.user.email,
          role: data.user.role,
          avatar: data.user.avatar,
          bio: data.user.bio,
          createdAt: data.user.created_at
        },
        token: data.token
      };
    }
  } catch (error) {
    if (error.message !== 'Failed to fetch') {
      throw error;
    }
  }

  // Fallback to mock database
  const { users } = getDb();
  const user = users.find((u) => u.email === email);
  
  if (!user) throw new Error('User not found');
  
  const token = btoa(JSON.stringify({ id: user.id, role: user.role }));
  return { user, token };
};

export const register = async (username, email, role, password) => {
  // Try backend first
  try {
    const backendAvailable = await isBackendAvailable();
    if (backendAvailable) {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password: password || 'password123', role })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
      }
      
      const data = await response.json();
      return {
        user: {
          id: data.user.id,
          username: data.user.username,
          email: data.user.email,
          role: data.user.role,
          avatar: data.user.avatar,
          bio: data.user.bio,
          createdAt: data.user.created_at
        },
        token: data.token
      };
    }
  } catch (error) {
    if (error.message !== 'Failed to fetch') {
      throw error;
    }
  }

  // Fallback to mock database
  const { users, posts } = getDb();
  if (users.find((u) => u.email === email)) throw new Error('Email already exists');

  const newUser = {
    id: 'u' + (users.length + 1),
    username,
    email,
    role,
    avatar: `https://picsum.photos/seed/${username}/200`,
    createdAt: new Date().toISOString()
  };

  const updatedUsers = [...users, newUser];
  saveDb(updatedUsers, posts);
  
  const token = btoa(JSON.stringify({ id: newUser.id, role: newUser.role }));
  return { user: newUser, token };
};

export const getCurrentUser = () => {
  // First check if we have a stored user in localStorage
  const storedUser = localStorage.getItem('currentUser');
  if (storedUser) {
    try {
      return JSON.parse(storedUser);
    } catch (e) {
      localStorage.removeItem('currentUser');
    }
  }
  
  // Fallback to token-based lookup in mock database
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token));
    const { users } = getDb();
    return users.find((u) => u.id === payload.id) || null;
  } catch (e) {
    return null;
  }
};

export const setCurrentUser = (user) => {
  localStorage.setItem('currentUser', JSON.stringify(user));
};

export const updateProfile = async (userId, updates) => {
  // Try backend first
  try {
    const backendAvailable = await isBackendAvailable();
    if (backendAvailable) {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updates)
      });
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Failed to fetch');
      }
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Update failed');
      }
      
      const userData = await response.json();
      const updatedUser = {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        role: userData.role,
        avatar: userData.avatar,
        bio: userData.bio,
        createdAt: userData.created_at
      };
      
      // Update localStorage
      setCurrentUser(updatedUser);
      return updatedUser;
    }
  } catch (error) {
    console.log('Backend not available, using localStorage');
  }

  // Fallback: Update directly from localStorage (works without backend or mock db)
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.id !== userId) {
    throw new Error('User not found');
  }
  
  const updatedUser = {
    ...currentUser,
    username: updates.username,
    bio: updates.bio,
    avatar: updates.avatar
  };
  
  // Save to localStorage
  setCurrentUser(updatedUser);
  
  // Also try to update mock database if user exists there
  try {
    const { users, posts } = getDb();
    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      saveDb(users, posts);
    }
  } catch (e) {
    // Ignore mock db errors
  }
  
  return updatedUser;
};

export const clearCurrentUser = () => {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('token');
};




