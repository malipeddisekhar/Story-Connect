import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserRole } from '../types';
import { postService } from '../services/postService';
import { authService } from '../services/authService';

const ProfileEnhanced = ({ user: currentUser }) => {
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('published');
  const [stats, setStats] = useState({
    published: 0,
    drafts: 0,
    totalLikes: 0,
    totalViews: 0
  });

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const userData = authService.getCurrentUser();
        console.log('Current user data:', userData);
        setUser(userData);

        if (userData) {
          const posts = await postService.getPostsByAuthor(userData.id);
          console.log('Fetched user posts:', posts);
          
          // Separate published and drafts
          const published = posts.filter(post => post.status === 'published');
          const drafts = posts.filter(post => post.status === 'draft');
          
          setUserPosts(published);
          
          // Calculate stats
          const totalLikes = published.reduce((sum, post) => sum + (post.likes || 0), 0);
          const totalViews = published.reduce((sum, post) => sum + (post.views || 0), 0);
          
          setStats({
            published: published.length,
            drafts: drafts.length,
            totalLikes,
            totalViews
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    return text.length <= maxLength ? text : text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-slate-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Profile Header */}
      <div className="bg-white dark:bg-slate-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            {/* Avatar */}
            <div className="relative">
              <img
                src={user?.avatar || 'https://via.placeholder.com/120x120?text=User'}
                alt={user?.username}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-indigo-500"
              />
              <div className="absolute -bottom-2 -right-2 bg-indigo-500 text-white px-3 py-1 rounded-full text-sm font-medium capitalize">
                {user?.role}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {user?.username}
              </h1>
              <p className="text-gray-600 dark:text-slate-400 mt-1">
                {user?.email}
              </p>
              {user?.bio && (
                <p className="text-gray-700 dark:text-slate-300 mt-2 max-w-2xl">
                  {user.bio}
                </p>
              )}
              
              {/* Stats */}
              <div className="flex justify-center sm:justify-start space-x-6 mt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">{stats.published}</div>
                  <div className="text-sm text-gray-600 dark:text-slate-400">Published</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.totalLikes}</div>
                  <div className="text-sm text-gray-600 dark:text-slate-400">Total Likes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalViews}</div>
                  <div className="text-sm text-gray-600 dark:text-slate-400">Total Views</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-3">
              <Link
                to="/settings"
                className="px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors text-center"
              >
                Edit Profile
              </Link>
              {user?.role !== UserRole.READER && (
                <Link
                  to="/create"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-center"
                >
                  Write New Story
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="border-b border-gray-200 dark:border-slate-700">
          <nav className="-mb-px flex space-x-8">
            <button
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'published'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('published')}
            >
              Published Stories ({stats.published})
            </button>
            {/* Add more tabs as needed */}
          </nav>
        </div>

        {/* Published Stories */}
        <div className="mt-6">
          {userPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No published stories yet
              </h3>
              <p className="text-gray-600 dark:text-slate-400 mb-6">
                Start sharing your stories with the world!
              </p>
              {user?.role !== UserRole.READER && (
                <Link
                  to="/create"
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Your First Story
                </Link>
              )}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {userPosts.map((post) => (
                <div key={post.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-2">
                        {post.title}
                      </h2>
                      <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-slate-400 ml-4">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>{post.views || 0}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-slate-400 text-sm mb-4 line-clamp-3">
                      {truncateText(post.excerpt || post.content)}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-slate-400">
                        <div className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          <span>{post.likes || 0}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <span>{post.comments || 0}</span>
                        </div>
                        <span>•</span>
                        <span>{formatDate(post.createdAt)}</span>
                      </div>

                      <Link
                        to={`/story/${post.id}`}
                        className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                      >
                        Read More
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileEnhanced;