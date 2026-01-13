import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { User, Post } from '../types';
import { getPostsByAuthor } from '../services/postService';
import { toggleFollow, isFollowing, getUserStats, UserStats } from '../services/readerService';

interface AuthorProfileProps {
  user: User | null;
}

const AuthorProfile: React.FC<AuthorProfileProps> = ({ user }) => {
  const { authorId } = useParams<{ authorId: string }>();
  const [author, setAuthor] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [stats, setStats] = useState<UserStats>({ followers: 0, following: 0, posts: 0, totalLikes: 0 });
  const [isFollowingAuthor, setIsFollowingAuthor] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authorId) {
      loadAuthorData();
    }
  }, [authorId]);

  useEffect(() => {
    if (user && authorId && user.id !== authorId) {
      checkFollowStatus();
    }
  }, [user, authorId]);

  const loadAuthorData = async () => {
    if (!authorId) return;
    setLoading(true);
    
    try {
      // Fetch author's posts
      const postsData = await getPostsByAuthor(authorId);
      setPosts(postsData.filter(p => p.published));
      
      // Get author info from a post or fetch separately
      if (postsData.length > 0) {
        setAuthor({
          id: authorId,
          username: postsData[0].authorName,
          avatar: `https://picsum.photos/seed/${postsData[0].authorName}/200`
        });
      } else {
        // Fetch author from API
        const response = await fetch(`http://localhost:5000/api/users`);
        const users = await response.json();
        const authorData = users.find((u: any) => u.id === authorId);
        if (authorData) {
          setAuthor(authorData);
        }
      }

      // Get stats
      const statsData = await getUserStats(authorId);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load author data:', error);
    }
    
    setLoading(false);
  };

  const checkFollowStatus = async () => {
    if (!user || !authorId) return;
    const status = await isFollowing(user.id, authorId);
    setIsFollowingAuthor(status);
  };

  const handleFollow = async () => {
    if (!user || !authorId) return;
    const newStatus = await toggleFollow(user.id, authorId);
    setIsFollowingAuthor(newStatus);
    setStats(prev => ({
      ...prev,
      followers: prev.followers + (newStatus ? 1 : -1)
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Author not found</h2>
          <Link to="/authors" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
            Browse all authors →
          </Link>
        </div>
      </div>
    );
  }

  const isOwnProfile = user?.id === authorId;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Author Header */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-8 mb-8 text-white">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <img 
              src={author.avatar} 
              className="w-28 h-28 rounded-full border-4 border-white/30 object-cover" 
              alt={author.username} 
            />
            <div className="flex-grow text-center md:text-left">
              <h1 className="text-3xl font-bold">{author.username}</h1>
              <p className="text-indigo-200 mt-2 max-w-xl">
                {author.bio || 'Storyteller sharing tales with the world'}
              </p>
              
              {/* Stats */}
              <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-6">
                <div>
                  <div className="text-2xl font-bold">{stats.posts}</div>
                  <div className="text-sm text-indigo-200">Stories</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.followers}</div>
                  <div className="text-sm text-indigo-200">Followers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.totalLikes}</div>
                  <div className="text-sm text-indigo-200">Total Likes</div>
                </div>
              </div>
            </div>
            
            {/* Follow Button */}
            {user && !isOwnProfile && (
              <button
                onClick={handleFollow}
                className={`px-8 py-3 rounded-full font-bold transition-all ${
                  isFollowingAuthor
                    ? 'bg-white/20 text-white hover:bg-red-500'
                    : 'bg-white text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                {isFollowingAuthor ? 'Following' : 'Follow'}
              </button>
            )}
            
            {isOwnProfile && (
              <Link 
                to="/profile" 
                className="px-8 py-3 bg-white/20 text-white rounded-full font-bold hover:bg-white/30 transition-colors"
              >
                Edit Profile
              </Link>
            )}
          </div>
        </div>

        {/* Stories Section */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Stories by {author.username}
          </h2>
          
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map(post => (
                <Link key={post.id} to={`/story/${post.id}`} className="group">
                  <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-xl transition-all">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={post.coverImage} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        alt={post.title} 
                      />
                    </div>
                    <div className="p-5">
                      <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                        {post.category}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mt-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-sm text-slate-400">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-slate-400">{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No stories yet</h3>
              <p className="text-slate-500 dark:text-slate-400">This author hasn't published any stories</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthorProfile;
