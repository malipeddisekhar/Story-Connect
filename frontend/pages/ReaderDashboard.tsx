import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Post } from '../types';
import { 
  getBookmarks, 
  getReadingHistory, 
  getFollowing, 
  getFeed,
  getUserStats,
  clearHistory,
  Author,
  UserStats
} from '../services/readerService';

interface ReaderDashboardProps {
  user: User;
}

const ReaderDashboard: React.FC<ReaderDashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'bookmarks' | 'history' | 'following'>('feed');
  const [bookmarks, setBookmarks] = useState<Post[]>([]);
  const [history, setHistory] = useState<Post[]>([]);
  const [following, setFollowing] = useState<Author[]>([]);
  const [feed, setFeed] = useState<Post[]>([]);
  const [stats, setStats] = useState<UserStats>({ followers: 0, following: 0, posts: 0, totalLikes: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user.id]);

  const loadData = async () => {
    setLoading(true);
    const [bookmarksData, historyData, followingData, feedData, statsData] = await Promise.all([
      getBookmarks(user.id),
      getReadingHistory(user.id),
      getFollowing(user.id),
      getFeed(user.id),
      getUserStats(user.id)
    ]);
    setBookmarks(bookmarksData);
    setHistory(historyData);
    setFollowing(followingData);
    setFeed(feedData);
    setStats(statsData);
    setLoading(false);
  };

  const handleClearHistory = async () => {
    if (confirm('Are you sure you want to clear your reading history?')) {
      await clearHistory(user.id);
      setHistory([]);
    }
  };

  const tabs = [
    { id: 'feed', label: 'My Feed', icon: '📰', count: feed.length },
    { id: 'bookmarks', label: 'Bookmarks', icon: '🔖', count: bookmarks.length },
    { id: 'history', label: 'History', icon: '📚', count: history.length },
    { id: 'following', label: 'Following', icon: '👥', count: following.length },
  ];

  const StoryCard = ({ post }: { post: Post }) => (
    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-4 flex gap-4 hover:shadow-lg transition-shadow">
      <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-xl">
        <img src={post.coverImage} className="w-full h-full object-cover" alt={post.title} />
      </div>
      <div className="flex-grow min-w-0">
        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{post.category}</span>
        <Link to={`/story/${post.id}`} className="block">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white hover:text-indigo-600 transition-colors line-clamp-1">{post.title}</h3>
        </Link>
        <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mt-1">{post.excerpt}</p>
        <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
          <span>{post.authorName}</span>
          <span>•</span>
          <span>{post.readTime}</span>
        </div>
      </div>
    </div>
  );

  const AuthorCard = ({ author }: { author: Author }) => (
    <Link 
      to={`/author/${author.id}`}
      className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-4 hover:shadow-lg transition-shadow"
    >
      <img src={author.avatar} className="w-14 h-14 rounded-full object-cover" alt={author.username} />
      <div className="flex-grow min-w-0">
        <h3 className="font-bold text-slate-900 dark:text-white">{author.username}</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-1">{author.bio || 'No bio yet'}</p>
        <div className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">{author.story_count} stories</div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-8 mb-8 text-white">
          <div className="flex items-center gap-6">
            <img src={user.avatar} className="w-20 h-20 rounded-full border-4 border-white/30" alt={user.username} />
            <div>
              <h1 className="text-3xl font-bold">{user.username}'s Dashboard</h1>
              <p className="text-indigo-200 mt-1">Discover, read, and enjoy stories from your favorite authors</p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold">{stats.following}</div>
              <div className="text-sm text-indigo-200">Following</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold">{bookmarks.length}</div>
              <div className="text-sm text-indigo-200">Bookmarks</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold">{history.length}</div>
              <div className="text-sm text-indigo-200">Stories Read</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold">{feed.length}</div>
              <div className="text-sm text-indigo-200">In Feed</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link to="/explore" className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-4 text-center hover:shadow-lg transition-all">
            <div className="text-3xl mb-2">🔍</div>
            <div className="font-bold text-slate-900 dark:text-white">Explore</div>
            <div className="text-xs text-slate-500">Find new stories</div>
          </Link>
          <Link to="/authors" className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-4 text-center hover:shadow-lg transition-all">
            <div className="text-3xl mb-2">✍️</div>
            <div className="font-bold text-slate-900 dark:text-white">Authors</div>
            <div className="text-xs text-slate-500">Discover writers</div>
          </Link>
          <Link to="/" className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-4 text-center hover:shadow-lg transition-all">
            <div className="text-3xl mb-2">🏠</div>
            <div className="font-bold text-slate-900 dark:text-white">Home</div>
            <div className="text-xs text-slate-500">Latest stories</div>
          </Link>
          <Link to="/profile" className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-4 text-center hover:shadow-lg transition-all">
            <div className="text-3xl mb-2">⚙️</div>
            <div className="font-bold text-slate-900 dark:text-white">Settings</div>
            <div className="text-xs text-slate-500">Edit profile</div>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 rounded-full font-bold text-sm whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-gray-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.id ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'
              }`}>{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-6">
            {/* Feed Tab */}
            {activeTab === 'feed' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">My Feed</h2>
                    <p className="text-sm text-slate-500">Stories from authors you follow</p>
                  </div>
                </div>
                {feed.length > 0 ? (
                  <div className="space-y-4">
                    {feed.map(post => <StoryCard key={post.id} post={post} />)}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="text-5xl mb-4">📰</div>
                    <p className="text-slate-500 dark:text-slate-400 mb-4">Your feed is empty</p>
                    <Link to="/authors" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                      Follow some authors to see their stories here →
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Bookmarks Tab */}
            {activeTab === 'bookmarks' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Bookmarks</h2>
                    <p className="text-sm text-slate-500">Stories you've saved for later</p>
                  </div>
                </div>
                {bookmarks.length > 0 ? (
                  <div className="space-y-4">
                    {bookmarks.map(post => <StoryCard key={post.id} post={post} />)}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="text-5xl mb-4">🔖</div>
                    <p className="text-slate-500 dark:text-slate-400 mb-4">No bookmarks yet</p>
                    <Link to="/" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                      Browse stories and bookmark your favorites →
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Reading History</h2>
                    <p className="text-sm text-slate-500">Recently read stories</p>
                  </div>
                  {history.length > 0 && (
                    <button 
                      onClick={handleClearHistory}
                      className="text-sm text-red-500 hover:text-red-600 font-bold"
                    >
                      Clear History
                    </button>
                  )}
                </div>
                {history.length > 0 ? (
                  <div className="space-y-4">
                    {history.map(post => <StoryCard key={post.id} post={post} />)}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="text-5xl mb-4">📚</div>
                    <p className="text-slate-500 dark:text-slate-400 mb-4">No reading history yet</p>
                    <Link to="/" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                      Start reading stories →
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Following Tab */}
            {activeTab === 'following' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Following</h2>
                    <p className="text-sm text-slate-500">Authors you follow</p>
                  </div>
                </div>
                {following.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {following.map(author => <AuthorCard key={author.id} author={author} />)}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="text-5xl mb-4">👥</div>
                    <p className="text-slate-500 dark:text-slate-400 mb-4">You're not following anyone yet</p>
                    <Link to="/authors" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                      Discover authors to follow →
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReaderDashboard;
