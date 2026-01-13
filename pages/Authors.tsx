import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User } from '../types';
import { getAllAuthors, toggleFollow, isFollowing, Author } from '../services/readerService';

interface AuthorsProps {
  user: User | null;
}

const Authors: React.FC<AuthorsProps> = ({ user }) => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadAuthors();
  }, []);

  useEffect(() => {
    if (user && authors.length > 0) {
      checkFollowingStatus();
    }
  }, [user, authors]);

  const loadAuthors = async () => {
    setLoading(true);
    const data = await getAllAuthors();
    setAuthors(data);
    setLoading(false);
  };

  const checkFollowingStatus = async () => {
    if (!user) return;
    const statusMap: Record<string, boolean> = {};
    for (const author of authors) {
      if (author.id !== user.id) {
        statusMap[author.id] = await isFollowing(user.id, author.id);
      }
    }
    setFollowingMap(statusMap);
  };

  const handleFollow = async (authorId: string) => {
    if (!user) return;
    const newStatus = await toggleFollow(user.id, authorId);
    setFollowingMap(prev => ({ ...prev, [authorId]: newStatus }));
    
    // Update follower count in UI
    setAuthors(prev => prev.map(a => 
      a.id === authorId 
        ? { ...a, follower_count: (a.follower_count || 0) + (newStatus ? 1 : -1) }
        : a
    ));
  };

  const filteredAuthors = authors.filter(author =>
    author.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (author.bio && author.bio.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const AuthorCard = ({ author }: { author: Author }) => {
    const isOwnProfile = user?.id === author.id;
    const isFollowingAuthor = followingMap[author.id] || false;

    return (
      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-6 hover:shadow-lg transition-all">
        <div className="flex items-start gap-4">
          <Link to={`/author/${author.id}`}>
            <img 
              src={author.avatar} 
              className="w-16 h-16 rounded-full object-cover border-2 border-slate-100 dark:border-slate-700 hover:border-indigo-300 transition-colors" 
              alt={author.username} 
            />
          </Link>
          <div className="flex-grow min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <Link to={`/author/${author.id}`} className="block">
                  <h3 className="font-bold text-slate-900 dark:text-white hover:text-indigo-600 transition-colors">
                    {author.username}
                  </h3>
                </Link>
                <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 mt-1">
                  <span>{author.story_count} stories</span>
                  <span>•</span>
                  <span>{author.follower_count || 0} followers</span>
                </div>
              </div>
              {user && !isOwnProfile && (
                <button
                  onClick={() => handleFollow(author.id)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                    isFollowingAuthor
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none'
                  }`}
                >
                  {isFollowingAuthor ? 'Following' : 'Follow'}
                </button>
              )}
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 line-clamp-2">
              {author.bio || 'No bio available'}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Discover Authors</h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Follow your favorite writers and get updates when they publish new stories
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Authors List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-600"></div>
          </div>
        ) : filteredAuthors.length > 0 ? (
          <div className="space-y-4">
            {filteredAuthors.map(author => (
              <AuthorCard key={author.id} author={author} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800">
            <div className="text-6xl mb-4">✍️</div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No authors found</h3>
            <p className="text-slate-500 dark:text-slate-400">Try a different search term</p>
          </div>
        )}

        {/* CTA for non-logged in users */}
        {!user && (
          <div className="mt-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-2">Want to follow authors?</h3>
            <p className="text-indigo-200 mb-6">Sign in or create an account to follow your favorite writers</p>
            <Link 
              to="/auth" 
              className="inline-block px-8 py-3 bg-white text-indigo-600 rounded-full font-bold hover:bg-indigo-50 transition-colors"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Authors;
