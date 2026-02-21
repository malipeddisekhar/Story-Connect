
import { getDb } from './mockDb';

// Use environment variable for API URL in production, fallback to production URL
const API_URL = import.meta.env.VITE_API_URL || 'https://storyconnect-backend.onrender.com/api';

// ==================== localStorage helpers ====================
const lsGet = (key, def) => { try { return JSON.parse(localStorage.getItem(key)) ?? def; } catch { return def; } };
const lsSet = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} };

// Helper to convert API response to Post format
const mapPost = (data) => ({
  id: data.id,
  title: data.title,
  excerpt: data.excerpt,
  content: data.content,
  authorId: data.author_id || data.authorId,
  authorName: data.author_name || data.authorName,
  category: data.category,
  coverImage: data.cover_image || data.coverImage,
  published: data.published,
  createdAt: data.created_at || data.createdAt,
  updatedAt: data.updated_at || data.updatedAt,
  readTime: data.read_time || data.readTime
});

// ==================== BOOKMARKS ====================

export const getBookmarks = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/bookmarks/${userId}`);
    if (response.ok) {
      const data = await response.json();
      return data.map(mapPost);
    }
  } catch (error) {
    console.error('Backend unavailable, using localStorage for getBookmarks');
  }
  // localStorage fallback: get bookmarked post IDs then find from mockDb
  const ids = lsGet(`bookmarks_${userId}`, []);
  if (ids.length === 0) return [];
  const { posts } = getDb();
  return posts.filter(p => ids.includes(p.id));
};

export const toggleBookmark = async (userId, postId) => {
  try {
    const response = await fetch(`${API_URL}/bookmarks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, postId })
    });
    if (response.ok) {
      const data = await response.json();
      return data.bookmarked;
    }
  } catch (error) {
    console.error('Backend unavailable, using localStorage for bookmarks');
  }
  // localStorage fallback
  const key = `bookmarks_${userId}`;
  const bookmarks = lsGet(key, []);
  const idx = bookmarks.indexOf(postId);
  if (idx === -1) { bookmarks.push(postId); lsSet(key, bookmarks); return true; }
  bookmarks.splice(idx, 1); lsSet(key, bookmarks); return false;
};

export const isBookmarked = async (userId, postId) => {
  try {
    const response = await fetch(`${API_URL}/bookmarks/${userId}/${postId}`);
    if (response.ok) {
      const data = await response.json();
      return data.bookmarked;
    }
  } catch (error) {
    console.error('Backend unavailable, using localStorage for isBookmarked');
  }
  return lsGet(`bookmarks_${userId}`, []).includes(postId);
};

// ==================== READING HISTORY ====================

export const getReadingHistory = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/history/${userId}`);
    if (response.ok) {
      const data = await response.json();
      return data.map(mapPost);
    }
  } catch (error) {
    console.error('Backend unavailable, using localStorage for reading history');
  }
  const ids = lsGet(`history_${userId}`, []);
  if (ids.length === 0) return [];
  const { posts } = getDb();
  return ids.map(id => posts.find(p => p.id === id)).filter(Boolean);
};

export const addToHistory = async (userId, postId) => {
  try {
    await fetch(`${API_URL}/history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, postId })
    });
  } catch (error) {
    console.error('Backend unavailable, using localStorage for history');
  }
  // always also persist locally
  const key = `history_${userId}`;
  const history = lsGet(key, []);
  const filtered = history.filter(id => id !== postId);
  filtered.unshift(postId);
  lsSet(key, filtered.slice(0, 50));
};

export const clearHistory = async (userId) => {
  try {
    await fetch(`${API_URL}/history/${userId}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
};

// ==================== LIKES ====================

export const toggleLike = async (userId, postId) => {
  try {
    const response = await fetch(`${API_URL}/posts/${postId}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    if (response.ok) {
      const data = await response.json();
      return data.liked;
    }
  } catch (error) {
    console.error('Backend unavailable, using localStorage for likes');
  }
  // localStorage fallback
  const key = `likes_${postId}`;
  const likes = lsGet(key, []);
  const idx = likes.indexOf(userId);
  if (idx === -1) { likes.push(userId); lsSet(key, likes); return true; }
  likes.splice(idx, 1); lsSet(key, likes); return false;
};

export const getLikeCount = async (postId) => {
  try {
    const response = await fetch(`${API_URL}/posts/${postId}/likes`);
    if (response.ok) {
      const data = await response.json();
      return data.count;
    }
  } catch (error) {
    console.error('Backend unavailable, using localStorage for likeCount');
  }
  return lsGet(`likes_${postId}`, []).length;
};

export const isLiked = async (userId, postId) => {
  try {
    const response = await fetch(`${API_URL}/posts/${postId}/likes/${userId}`);
    if (response.ok) {
      const data = await response.json();
      return data.liked;
    }
  } catch (error) {
    console.error('Backend unavailable, using localStorage for isLiked');
  }
  return lsGet(`likes_${postId}`, []).includes(userId);
};

// ==================== COMMENTS ====================

export const getComments = async (postId) => {
  try {
    const response = await fetch(`${API_URL}/posts/${postId}/comments`);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('Backend unavailable, using localStorage for comments');
  }
  return lsGet(`comments_${postId}`, []);
};

export const addComment = async (postId, userId, content) => {
  try {
    const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, content })
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('Backend unavailable, using localStorage for comments');
  }
  // localStorage fallback
  const key = `comments_${postId}`;
  const comments = lsGet(key, []);
  const user = lsGet('currentUser', null);
  const newComment = {
    id: 'c' + Date.now(),
    postId,
    userId,
    username: user?.username || 'Anonymous',
    avatar: user?.avatar || `https://picsum.photos/seed/${userId}/200`,
    content,
    created_at: new Date().toISOString()
  };
  comments.unshift(newComment);
  lsSet(key, comments);
  return newComment;
};

// ==================== FOLLOWS ====================

export const getFollowing = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/following/${userId}`);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('Failed to fetch following:', error);
  }
  return [];
};

export const getFollowers = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/followers/${userId}`);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('Failed to fetch followers:', error);
  }
  return [];
};

export const toggleFollow = async (followerId, followingId) => {
  try {
    const response = await fetch(`${API_URL}/follows`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ followerId, followingId })
    });
    if (response.ok) {
      const data = await response.json();
      return data.following;
    }
  } catch (error) {
    console.error('Backend unavailable, using localStorage for follow');
  }
  // localStorage fallback
  const key = `following_${followerId}`;
  const following = lsGet(key, []);
  const idx = following.indexOf(followingId);
  if (idx === -1) { following.push(followingId); lsSet(key, following); return true; }
  following.splice(idx, 1); lsSet(key, following); return false;
};

export const isFollowing = async (followerId, followingId) => {
  try {
    const response = await fetch(`${API_URL}/follows/${followerId}/${followingId}`);
    if (response.ok) {
      const data = await response.json();
      return data.following;
    }
  } catch (error) {
    console.error('Backend unavailable, using localStorage for isFollowing');
  }
  return lsGet(`following_${followerId}`, []).includes(followingId);
};

export const getUserStats = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/stats`);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('Failed to get user stats:', error);
  }
  return { followers: 0, following: 0, posts: 0, totalLikes: 0 };
};

// ==================== SEARCH & DISCOVERY ====================

export const searchPosts = async (query, category) => {
  try {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (category && category !== 'All') params.append('category', category);
    
    const response = await fetch(`${API_URL}/search?${params.toString()}`);
    const contentType = response.headers.get('content-type');
    if (response.ok && contentType && contentType.includes('application/json')) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        return data.map(mapPost);
      }
    }
  } catch (error) {
    console.log('Backend unavailable for search, using mock data');
  }
  
  // Fallback to mock database
  const { posts } = getDb();
  // Handle both boolean true and truthy values for published
  let filtered = posts.filter((p) => p.published === true || p.published === 1 || p.published === 'true');
  
  // If no published posts, use all posts
  if (filtered.length === 0) {
    filtered = posts;
  }
  
  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter((p) => 
      p.title.toLowerCase().includes(q) || 
      p.content.toLowerCase().includes(q) ||
      p.authorName.toLowerCase().includes(q)
    );
  }
  
  if (category && category !== 'All') {
    filtered = filtered.filter((p) => p.category === category);
  }
  
  return filtered;
};

export const getCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/categories`);
    const contentType = response.headers.get('content-type');
    if (response.ok && contentType && contentType.includes('application/json')) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (error) {
    console.log('Backend unavailable for categories, using mock data');
  }
  
  // Fallback to mock database
  const { posts } = getDb();
  // Get categories from all posts (since published might be various types)
  const categories = [...new Set(posts.map((p) => p.category).filter(Boolean))];
  return categories.length > 0 ? categories : ['Technology', 'Lifestyle', 'Philosophy'];
};

export const getFeed = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/feed/${userId}`);
    const contentType = response.headers.get('content-type');
    if (response.ok && contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return data.map(mapPost);
    }
  } catch (error) {
    console.log('Backend unavailable for feed, using mock data');
  }
  
  // Fallback to mock database - return all published posts
  const { posts } = getDb();
  return posts.filter((p) => p.published === true);
};

export const getAllAuthors = async () => {
  try {
    const response = await fetch(`${API_URL}/authors`);
    const contentType = response.headers.get('content-type');
    if (response.ok && contentType && contentType.includes('application/json')) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (error) {
    console.log('Backend unavailable for authors, using mock data');
  }
  
  // Fallback to mock database
  const { users, posts } = getDb();
  return users
    .filter((u) => u.role === 'AUTHOR' || u.role === 'ADMIN')
    .map((u) => ({
      id: u.id,
      username: u.username,
      avatar: u.avatar,
      bio: u.bio || '',
      role: u.role,
      story_count: posts.filter((p) => p.authorId === u.id && p.published).length,
      follower_count: 0
    }));
};

export const readerService = {
  getBookmarks,
  toggleBookmark,
  isBookmarked,
  getReadingHistory,
  addToHistory,
  clearHistory,
  toggleLike,
  getLikeCount,
  isLiked,
  getComments,
  addComment,
  getFollowing,
  getFollowers,
  toggleFollow,
  isFollowing,
  getUserStats,
  searchPosts,
  getCategories,
  getFeed,
  getAllAuthors,
};




