import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postService } from '../services/postService';
import { readerService } from '../services/readerService';
import { UserRole } from '../types';

const StoryViewEnhanced = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [relatedStories, setRelatedStories] = useState([]);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        setLoading(true);
        const storyData = await postService.getPost(id);
        setStory(storyData);
        
        // Check if user has liked or bookmarked
        if (user) {
          const userLikes = await readerService.getUserLikes(user.id);
          const userBookmarks = await readerService.getUserBookmarks(user.id);
          
          setIsLiked(userLikes.some(like => like.postId === parseInt(id)));
          setIsBookmarked(userBookmarks.some(bookmark => bookmark.postId === parseInt(id)));
        }
        
        // Fetch related stories (same author or similar tags)
        const allPosts = await postService.getAllPosts();
        const related = allPosts
          .filter(post => 
            post.id !== parseInt(id) && 
            post.status === 'published' && 
            (post.authorId === storyData.authorId || 
             (post.tags && storyData.tags && 
              post.tags.some(tag => storyData.tags.includes(tag))))
          )
          .slice(0, 4);
        setRelatedStories(related);
        
      } catch (error) {
        console.error('Error fetching story:', error);
        setError('Story not found');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStory();
    }
  }, [id, user]);

  // Track reading progress
  useEffect(() => {
    if (!story) return;

    const handleScroll = () => {
      const content = document.querySelector('.story-content');
      if (!content) return;

      const contentTop = content.offsetTop;
      const contentHeight = content.scrollHeight;
      const windowHeight = window.innerHeight;
      const scrollTop = window.scrollY;

      const progress = Math.min(
        Math.max((scrollTop - contentTop + windowHeight/2) / contentHeight, 0),
        1
      );
      setReadingProgress(progress * 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [story]);

  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      if (isLiked) {
        await readerService.unlikePost(user.id, story.id);
        setStory(prev => ({ ...prev, likes: (prev.likes || 0) - 1 }));
      } else {
        await readerService.likePost(user.id, story.id);
        setStory(prev => ({ ...prev, likes: (prev.likes || 0) + 1 }));
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      if (isBookmarked) {
        await readerService.removeBookmark(user.id, story.id);
      } else {
        await readerService.addBookmark(user.id, story.id);
      }
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    try {
      const comment = await readerService.addComment(user.id, story.id, newComment);
      setComments([...comments, comment]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
    const words = content?.split(' ').length || 0;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-slate-400">Loading story...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 text-lg">{error}</p>
          <Link to="/" className="text-indigo-600 hover:text-indigo-700 mt-4 inline-block">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-slate-700 z-50">
        <div 
          className="h-full bg-indigo-600 transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Story Header */}
      <div className="bg-white dark:bg-slate-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {story.title}
            </h1>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 text-gray-600 dark:text-slate-400">
              <div className="flex items-center space-x-3">
                <img
                  src={story.authorAvatar || 'https://via.placeholder.com/40x40?text=A'}
                  alt={story.authorName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="text-left">
                  <Link
                    to={`/author/${story.authorId}`}
                    className="font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    {story.authorName}
                  </Link>
                  <div className="text-sm text-gray-500 dark:text-slate-500">
                    {formatDate(story.createdAt)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-sm">
                <span>{calculateReadTime(story.content)}</span>
                <span>•</span>
                <span>{story.views || 0} views</span>
                <span>•</span>
                <span>{story.likes || 0} likes</span>
              </div>
            </div>

            {/* Tags */}
            {story.tags && story.tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                {story.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Story Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm">
          {/* Story Image */}
          {story.image && (
            <div className="aspect-w-16 aspect-h-9 mb-8">
              <img
                src={story.image}
                alt={story.title}
                className="w-full h-96 object-cover rounded-t-xl"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-8">
            <div className="story-content">
              <div 
                className="prose prose-lg dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: story.content?.replace(/\n/g, '<br/>') }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t border-gray-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isLiked
                      ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  <svg className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>{story.likes || 0}</span>
                </button>

                <button
                  onClick={handleBookmark}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isBookmarked
                      ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  <svg className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  <span>Bookmark</span>
                </button>

                <button
                  onClick={() => setShowComments(!showComments)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>{comments.length} Comments</span>
                </button>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigator.share ? navigator.share({ title: story.title, url: window.location.href }) : navigator.clipboard.writeText(window.location.href)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="border-t border-gray-200 dark:border-slate-700 p-6">
              {/* Add Comment Form */}
              {user ? (
                <form onSubmit={handleCommentSubmit} className="mb-6">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    rows={3}
                  />
                  <div className="mt-3 flex justify-end">
                    <button
                      type="submit"
                      disabled={!newComment.trim()}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Post Comment
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-600 dark:text-slate-400 mb-4">Sign in to join the conversation</p>
                  <Link
                    to="/login"
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Sign In
                  </Link>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <img
                        src={comment.userAvatar || 'https://via.placeholder.com/32x32?text=U'}
                        alt={comment.username}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {comment.username}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-slate-400">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="mt-1 text-gray-700 dark:text-slate-300">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Stories */}
      {relatedStories.length > 0 && (
        <div className="bg-white dark:bg-slate-800 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              More from {story.authorName}
            </h2>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {relatedStories.map((relatedStory) => (
                <Link
                  key={relatedStory.id}
                  to={`/story/${relatedStory.id}`}
                  className="group bg-gray-50 dark:bg-slate-700 rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2">
                    {relatedStory.title}
                  </h3>
                  <p className="text-gray-600 dark:text-slate-400 text-sm line-clamp-3">
                    {relatedStory.excerpt || relatedStory.content?.substring(0, 100) + '...'}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-slate-500">
                    <span>{formatDate(relatedStory.createdAt)}</span>
                    <div className="flex items-center space-x-2">
                      <span>{relatedStory.likes || 0} ❤️</span>
                      <span>{relatedStory.views || 0} 👁️</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryViewEnhanced;