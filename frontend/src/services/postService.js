

import { getDb, saveDb } from './mockDb';

// Use environment variable for API URL in production, fallback to production URL
const API_URL = import.meta.env.VITE_API_URL || 'https://storyconnect-backend.onrender.com/api';

// Check if backend is available
const isBackendAvailable = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    
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

export const getAllPosts = async () => {
  // Try backend first
  try {
    const backendAvailable = await isBackendAvailable();
    if (backendAvailable) {
      const response = await fetch(`${API_URL}/posts`);
      const contentType = response.headers.get('content-type');
      if (response.ok && contentType && contentType.includes('application/json')) {
        const data = await response.json();
        const posts = data.map(mapPost);
        if (posts.length > 0) {
          return posts;
        }
      }
    }
  } catch (error) {
    console.log('Backend unavailable, using mock data');
  }
  
  // Always fallback to mock database
  const { posts } = getDb();
  // Filter for published posts (handle both boolean and truthy values)
  const publishedPosts = posts.filter((p) => p.published === true || p.published === 1 || p.published === 'true');
  console.log('Returning mock posts:', publishedPosts.length);
  
  // If still no posts, return all posts from mock
  if (publishedPosts.length === 0 && posts.length > 0) {
    console.log('No published posts found, returning all posts');
    return posts;
  }
  
  return publishedPosts;
};

export const getAdminPosts = async () => {
  try {
    const backendAvailable = await isBackendAvailable();
    if (backendAvailable) {
      const response = await fetch(`${API_URL}/posts`);
      const contentType = response.headers.get('content-type');
      if (response.ok && contentType && contentType.includes('application/json')) {
        const data = await response.json();
        return data.map(mapPost);
      }
    }
  } catch (error) {
    console.log('Backend unavailable, using mock data');
  }
  
  const { posts } = getDb();
  return posts;
};

export const getPostsByAuthor = async (authorId) => {
  try {
    const backendAvailable = await isBackendAvailable();
    if (backendAvailable) {
      const response = await fetch(`${API_URL}/posts/author/${authorId}`);
      const contentType = response.headers.get('content-type');
      if (response.ok && contentType && contentType.includes('application/json')) {
        const data = await response.json();
        return data.map(mapPost);
      }
    }
  } catch (error) {
    console.log('Backend unavailable, using mock data');
  }
  
  const { posts } = getDb();
  return posts.filter((p) => p.authorId === authorId);
};

export const getPostById = async (id) => {
  try {
    const backendAvailable = await isBackendAvailable();
    if (backendAvailable) {
      const response = await fetch(`${API_URL}/posts/${id}`);
      const contentType = response.headers.get('content-type');
      if (response.ok && contentType && contentType.includes('application/json')) {
        const data = await response.json();
        return mapPost(data);
      }
    }
  } catch (error) {
    console.log('Backend unavailable, using mock data');
  }
  
  const { posts } = getDb();
  return posts.find((p) => p.id === id);
};

export const createPost = async (postData) => {
  try {
    const backendAvailable = await isBackendAvailable();
    if (backendAvailable) {
      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: postData.title,
          excerpt: postData.excerpt,
          content: postData.content,
          authorId: postData.authorId,
          authorName: postData.authorName,
          category: postData.category,
          coverImage: postData.coverImage,
          published: postData.published,
          readTime: Math.ceil((postData.content?.split(' ').length || 0) / 200) + ' min'
        })
      });
      const contentType = response.headers.get('content-type');
      if (response.ok && contentType && contentType.includes('application/json')) {
        const data = await response.json();
        return mapPost(data);
      }
    }
  } catch (error) {
    console.log('Backend unavailable, using mock data');
  }
  
  const { users, posts } = getDb();
  const newPost = {
    id: 'p' + Date.now(),
    title: postData.title || 'Untitled',
    excerpt: postData.excerpt || '',
    content: postData.content || '',
    authorId: postData.authorId || '',
    authorName: postData.authorName || 'Unknown',
    category: postData.category || 'General',
    coverImage: postData.coverImage || 'https://picsum.photos/seed/new/800/400',
    published: postData.published ?? true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    readTime: Math.ceil((postData.content?.split(' ').length || 0) / 200) + ' min'
  };

  const updatedPosts = [newPost, ...posts];
  saveDb(users, updatedPosts);
  return newPost;
};

export const updatePost = async (id, postData) => {
  try {
    const backendAvailable = await isBackendAvailable();
    if (backendAvailable) {
      const response = await fetch(`${API_URL}/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: postData.title,
          excerpt: postData.excerpt,
          content: postData.content,
          category: postData.category,
          coverImage: postData.coverImage,
          published: postData.published,
          readTime: Math.ceil((postData.content?.split(' ').length || 0) / 200) + ' min'
        })
      });
      const contentType = response.headers.get('content-type');
      if (response.ok && contentType && contentType.includes('application/json')) {
        const data = await response.json();
        return mapPost(data);
      }
    }
  } catch (error) {
    console.log('Backend unavailable, using mock data');
  }
  
  const { users, posts } = getDb();
  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) throw new Error('Post not found');

  const updatedPost = { 
    ...posts[index], 
    ...postData, 
    updatedAt: new Date().toISOString() 
  };
  posts[index] = updatedPost;
  
  saveDb(users, posts);
  return updatedPost;
};

export const deletePost = async (id) => {
  try {
    const backendAvailable = await isBackendAvailable();
    if (backendAvailable) {
      const response = await fetch(`${API_URL}/posts/${id}`, {
        method: 'DELETE'
      });
      const contentType = response.headers.get('content-type');
      if (response.ok && contentType && contentType.includes('application/json')) {
        return;
      }
    }
  } catch (error) {
    console.log('Backend unavailable, using mock data');
  }
  
  const { users, posts } = getDb();
  const updatedPosts = posts.filter((p) => p.id !== id);
  saveDb(users, updatedPosts);
};




