import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';
import { getAllPosts } from '../services/postService';
import { searchPosts, getCategories } from '../services/readerService';

const Explore: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [postsData, categoriesData] = await Promise.all([
        getAllPosts(),
        getCategories()
      ]);
      console.log('Loaded posts:', postsData.length);
      console.log('Loaded categories:', categoriesData);
      setPosts(postsData);
      setFilteredPosts(postsData);
      setCategories(['All', ...categoriesData]);
      setDataLoaded(true);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  const handleSearch = async () => {
    if (!dataLoaded) return;
    
    setLoading(true);
    try {
      if (searchQuery || selectedCategory !== 'All') {
        const results = await searchPosts(searchQuery, selectedCategory);
        setFilteredPosts(results);
      } else {
        setFilteredPosts(posts);
      }
    } catch (error) {
      console.error('Search error:', error);
      setFilteredPosts(posts);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!dataLoaded) return;
    
    const delaySearch = setTimeout(() => {
      handleSearch();
    }, 300);
    return () => clearTimeout(delaySearch);
  }, [searchQuery, selectedCategory, dataLoaded]);

  const StoryCardGrid = ({ post }: { post: Post }) => (
    <Link to={`/story/${post.id}`} className="group">
      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-xl transition-all">
        <div className="h-48 overflow-hidden">
          <img 
            src={post.coverImage} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
            alt={post.title} 
          />
        </div>
        <div className="p-5">
          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{post.category}</span>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2 group-hover:text-indigo-600 transition-colors line-clamp-2">{post.title}</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mt-2">{post.excerpt}</p>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">{post.authorName}</span>
            <span className="text-xs text-slate-400">{post.readTime}</span>
          </div>
        </div>
      </div>
    </Link>
  );

  const StoryCardList = ({ post }: { post: Post }) => (
    <Link to={`/story/${post.id}`} className="group">
      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-4 flex gap-4 hover:shadow-lg transition-shadow">
        <div className="w-32 h-24 flex-shrink-0 overflow-hidden rounded-xl">
          <img src={post.coverImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt={post.title} />
        </div>
        <div className="flex-grow min-w-0">
          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{post.category}</span>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors line-clamp-1">{post.title}</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mt-1">{post.excerpt}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
            <span className="font-medium text-slate-600 dark:text-slate-300">{post.authorName}</span>
            <span>•</span>
            <span>{post.readTime}</span>
            <span>•</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Explore Stories</h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Discover amazing stories from talented writers across all genres
          </p>
        </div>

        {/* Search & Filter */}
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-grow relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search stories, authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-0 focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              {categories.slice(0, 6).map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                    selectedCategory === category
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* View Toggle */}
            <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
              <button
                onClick={() => setView('grid')}
                className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-white dark:bg-slate-700 shadow' : ''}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-white dark:bg-slate-700 shadow' : ''}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-slate-600 dark:text-slate-400">
            {filteredPosts.length} {filteredPosts.length === 1 ? 'story' : 'stories'} found
          </p>
          {selectedCategory !== 'All' && (
            <button 
              onClick={() => setSelectedCategory('All')}
              className="text-sm text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Stories */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-600"></div>
          </div>
        ) : filteredPosts.length > 0 ? (
          view === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map(post => <StoryCardGrid key={post.id} post={post} />)}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPosts.map(post => <StoryCardList key={post.id} post={post} />)}
            </div>
          )
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No stories found</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Try adjusting your search or filters</p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                loadData();
              }}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
            >
              Reset & Reload Stories
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
