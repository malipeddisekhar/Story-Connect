import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserRole } from '../types';
import { postService } from '../services/postService';

const HomeEnhanced = ({ user }) => {
  const [featuredStories, setFeaturedStories] = useState([]);
  const [popularStories, setPopularStories] = useState([]);
  const [recentStories, setRecentStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('featured');

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [allPosts] = await Promise.all([postService.getAllPosts()]);
        
        // Sort and filter posts for different sections
        const publishedPosts = allPosts.filter(post => post.status === 'published');
        
        // Featured stories (highest engagement)
        const featured = publishedPosts
          .sort((a, b) => ((b.likes || 0) + (b.views || 0)) - ((a.likes || 0) + (a.views || 0)))
          .slice(0, 6);
        
        // Popular stories (most liked)
        const popular = publishedPosts
          .sort((a, b) => (b.likes || 0) - (a.likes || 0))
          .slice(0, 8);
        
        // Recent stories
        const recent = publishedPosts
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 8);
        
        setFeaturedStories(featured);
        setPopularStories(popular);
        setRecentStories(recent);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const truncateText = (text, maxLength = 120) => {
    if (!text) return '';
    return text.length <= maxLength ? text : text.substring(0, maxLength) + '...';
  };

  const StoryCard = ({ post, featured = false }) => (
    <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden ${featured ? 'md:flex' : ''}`}>
      {post.image && (
        <div className={featured ? 'md:w-1/2' : 'w-full'}>
          <img
            src={post.image}
            alt={post.title}
            className={`w-full object-cover ${featured ? 'h-64 md:h-full' : 'h-48'}`}
          />
        </div>
      )}
      <div className={`p-6 ${featured && post.image ? 'md:w-1/2' : 'w-full'}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <img
              src={post.authorAvatar || 'https://via.placeholder.com/32x32?text=A'}
              alt={post.authorName}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {post.authorName}
              </p>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                {formatDate(post.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-slate-400">
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
              </svg>
              <span>{post.likes || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{post.views || 0}</span>
            </div>
          </div>
        </div>
        
        <h2 className={`font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 ${featured ? 'text-xl' : 'text-lg'}`}>
          {post.title}
        </h2>
        
        <p className="text-gray-600 dark:text-slate-400 text-sm mb-4 line-clamp-3">
          {truncateText(post.excerpt || post.content)}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {post.tags && post.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <Link
            to={`/story/${post.id}`}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium text-sm transition-colors"
          >
            Read More
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-slate-400">Loading stories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                StoryConnect
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
              Discover amazing stories, connect with talented authors, and share your own creative works with the world.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link
                to="/explore"
                className="w-full sm:w-auto px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
              >
                Explore Stories
              </Link>
              
              {user ? (
                user.role !== UserRole.READER && (
                  <Link
                    to="/create"
                    className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-indigo-600 transition-colors"
                  >
                    Start Writing
                  </Link>
                )
              ) : (
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-indigo-600 transition-colors"
                >
                  Join Community
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Stories */}
      {featuredStories.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Featured Stories
              </h2>
              <p className="text-lg text-gray-600 dark:text-slate-400">
                Discover the most engaging content from our community
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2">
              {featuredStories.slice(0, 2).map((post) => (
                <StoryCard key={post.id} post={post} featured={true} />
              ))}
            </div>
            
            {featuredStories.length > 2 && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-8">
                {featuredStories.slice(2, 6).map((post) => (
                  <StoryCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Story Sections */}
      <section className="py-16 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="flex space-x-1 bg-gray-100 dark:bg-slate-700 rounded-xl p-1">
              <button
                onClick={() => setActiveTab('featured')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'featured'
                    ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Featured
              </button>
              <button
                onClick={() => setActiveTab('popular')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'popular'
                    ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Popular
              </button>
              <button
                onClick={() => setActiveTab('recent')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'recent'
                    ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Recent
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {activeTab === 'featured' && featuredStories.map((post) => (
              <StoryCard key={`featured-${post.id}`} post={post} />
            ))}
            {activeTab === 'popular' && popularStories.map((post) => (
              <StoryCard key={`popular-${post.id}`} post={post} />
            ))}
            {activeTab === 'recent' && recentStories.map((post) => (
              <StoryCard key={`recent-${post.id}`} post={post} />
            ))}
          </div>

          {/* View More Button */}
          <div className="text-center mt-12">
            <Link
              to="/explore"
              className="inline-flex items-center px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
            >
              Explore All Stories
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      {!user && (
        <section className="py-16 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Join Our Community?
            </h2>
            <p className="text-xl text-gray-200 mb-8">
              Connect with fellow storytellers, share your creativity, and discover amazing content.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-3 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
              >
                Sign Up Free
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-3 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-indigo-600 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomeEnhanced;