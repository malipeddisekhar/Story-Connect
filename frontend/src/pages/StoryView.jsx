
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { UserRole } from '../types';
import { getPostById, deletePost } from '../services/postService';
import { getCurrentUser } from '../services/authService';
import { 
  toggleLike, 
  getLikeCount, 
  isLiked, 
  toggleBookmark, 
  isBookmarked, 
  addToHistory,
  getComments,
  addComment,
  isFollowing,
  toggleFollow
} from '../services/readerService';

const StoryView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Reader features state
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [following, setFollowing] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [shareMessage, setShareMessage] = useState('');

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    
    const fetchPost = async () => {
      if (!id) return;
      const data = await getPostById(id);
      if (data) setPost(data);
      setLoading(false);
    };
    fetchPost();
  }, [id]);

  // Load reader features data
  useEffect(() => {
    if (!id || !post) return;
    
    const loadReaderData = async () => {
      // Get like count
      const count = await getLikeCount(id);
      setLikeCount(count);
      
      // Get comments
      const commentsData = await getComments(id);
      setComments(commentsData);
      
      if (currentUser) {
        // Check if liked/bookmarked/following
        const [likedStatus, bookmarkStatus, followStatus] = await Promise.all([
          isLiked(currentUser.id, id),
          isBookmarked(currentUser.id, id),
          post.authorId !== currentUser.id ? isFollowing(currentUser.id, post.authorId) : Promise.resolve(false)
        ]);
        setLiked(likedStatus);
        setBookmarked(bookmarkStatus);
        setFollowing(followStatus);
        
        // Add to reading history
        await addToHistory(currentUser.id, id);
      }
    };
    
    loadReaderData();
  }, [id, post, currentUser]);

  const handleLike = async () => {
    if (!currentUser || !id) return;
    const newStatus = await toggleLike(currentUser.id, id);
    setLiked(newStatus);
    setLikeCount(prev => newStatus ? prev + 1 : prev - 1);
  };

  const handleBookmark = async () => {
    if (!currentUser || !id) return;
    const newStatus = await toggleBookmark(currentUser.id, id);
    setBookmarked(newStatus);
  };

  const handleFollow = async () => {
    if (!currentUser || !post || currentUser.id === post.authorId) return;
    const newStatus = await toggleFollow(currentUser.id, post.authorId);
    setFollowing(newStatus);
  };

  const handleAddComment = async () => {
    if (!currentUser || !id || !newComment.trim()) return;
    setSubmitting(true);
    const comment = await addComment(id, currentUser.id, newComment.trim());
    if (comment) {
      setComments(prev => [comment, ...prev]);
      setNewComment('');
    }
    setSubmitting(false);
  };

  const handleDelete = async () => {
    if (!post) return;
    if (window.confirm('Are you sure you want to permanently delete this story?')) {
      await deletePost(post.id);
      navigate('/');
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    try {
      // Try native share API first (mobile devices)
      if (navigator.share) {
        await navigator.share({
          title: post?.title || 'Story',
          text: post?.excerpt || 'Check out this story!',
          url: url
        });
        setShareMessage('Shared successfully!');
      } else {
        // Fallback to clipboard for desktop
        await navigator.clipboard.writeText(url);
        setShareMessage('Link copied to clipboard!');
      }
      
      // Clear message after 3 seconds
      setTimeout(() => setShareMessage(''), 3000);
    } catch (error) {
      console.error('Share failed:', error);
      // Manual fallback if clipboard fails
      const textArea = document.createElement('textarea');
      textArea.value = url;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setShareMessage('Link copied to clipboard!');
        setTimeout(() => setShareMessage(''), 3000);
      } catch (err) {
        setShareMessage('Unable to copy link');
        setTimeout(() => setShareMessage(''), 3000);
      }
      document.body.removeChild(textArea);
    }
  };

  const isOwner = currentUser && post && (currentUser.id === post.authorId);
  const isAdmin = currentUser && (currentUser.role === UserRole.ADMIN);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="p-20 text-center dark:text-slate-400">
        <h2 className="text-2xl font-bold mb-4">Story not found.</h2>
        <Link to="/" className="text-indigo-600 hover:underline">Back to safety</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <header className="mb-12 text-center">
        <div className="mb-6">
          <span className="px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-black rounded-full uppercase tracking-[0.2em] transition-colors border border-indigo-100 dark:border-indigo-800">
            {post.category}
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 dark:text-white mb-8 leading-tight transition-colors">
          {post.title}
        </h1>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to={`/author/${post.authorId}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img 
                src={`https://picsum.photos/seed/${post.authorName}/100`} 
                alt={post.authorName} 
                className="w-12 h-12 rounded-full border-2 border-indigo-100 dark:border-slate-800 transition-colors"
              />
              <div className="text-left">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{post.authorName}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified Creator</p>
              </div>
            </Link>
            {currentUser && !isOwner && (
              <button
                onClick={handleFollow}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  following
                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {following ? 'Following' : 'Follow'}
              </button>
            )}
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden md:block"></div>
          <div className="text-xs text-slate-400 font-medium">
            Published {new Date(post.createdAt).toLocaleDateString()} • {post.readTime} reading time
          </div>
        </div>
      </header>

      <div className="mb-16 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-indigo-100 dark:shadow-none transition-all">
        <img 
          src={post.coverImage} 
          alt={post.title} 
          className="w-full h-auto max-h-[500px] object-cover"
        />
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="prose prose-lg prose-indigo dark:prose-invert text-slate-700 dark:text-slate-300 leading-[1.8] whitespace-pre-wrap font-light transition-colors drop-cap">
          {post.content}
        </div>

        <hr className="my-16 border-slate-100 dark:border-slate-800 transition-colors" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-50 dark:bg-slate-900/50 p-8 rounded-3xl border border-slate-100 dark:border-slate-800">
          <div className="flex gap-3">
            {/* Like Button */}
            <button 
              onClick={currentUser ? handleLike : () => navigate('/auth')}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all ${
                liked 
                  ? 'bg-red-50 dark:bg-red-900/30 text-red-500 border border-red-200 dark:border-red-800' 
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill={liked ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              {likeCount > 0 && <span>{likeCount}</span>}
            </button>

            {/* Comment Button */}
            <button 
              onClick={() => setShowComments(!showComments)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all ${
                showComments
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 border border-indigo-200 dark:border-indigo-800'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
              {comments.length > 0 && <span>{comments.length}</span>}
            </button>

            {/* Bookmark Button */}
            <button 
              onClick={currentUser ? handleBookmark : () => navigate('/auth')}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all ${
                bookmarked 
                  ? 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 border border-yellow-200 dark:border-yellow-800' 
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill={bookmarked ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
              </svg>
            </button>

            {/* Share Button */}
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold hover:shadow-lg transition-all text-slate-700 dark:text-slate-300 relative"
              title="Share this story"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
              </svg>
              {shareMessage && (
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-green-600 text-white text-xs rounded-lg whitespace-nowrap">
                  {shareMessage}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-4">
            {(isOwner || isAdmin) && (
              <>
                <Link to={`/edit/${post.id}`} className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all">
                  Edit Story
                </Link>
                <button onClick={handleDelete} className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all border border-transparent hover:border-red-100">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </>
            )}
            <button 
              onClick={() => navigate('/')}
              className="text-slate-400 dark:text-slate-500 font-bold hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Back Home
            </button>
          </div>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              Comments ({comments.length})
            </h3>

            {/* Add Comment */}
            {currentUser ? (
              <div className="flex gap-4 mb-8">
                <img 
                  src={currentUser.avatar} 
                  className="w-10 h-10 rounded-full flex-shrink-0" 
                  alt={currentUser.username} 
                />
                <div className="flex-grow">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-0 focus:ring-2 focus:ring-indigo-500 resize-none"
                    rows={3}
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={handleAddComment}
                      disabled={!newComment.trim() || submitting}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-full text-sm font-bold disabled:opacity-50 hover:bg-indigo-700 transition-all"
                    >
                      {submitting ? 'Posting...' : 'Post Comment'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 mb-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                <p className="text-slate-500 dark:text-slate-400 mb-2">Sign in to join the conversation</p>
                <Link to="/auth" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                  Sign in →
                </Link>
              </div>
            )}

            {/* Comments List */}
            {comments.length > 0 ? (
              <div className="space-y-6">
                {comments.map(comment => (
                  <div key={comment.id} className="flex gap-4">
                    <img 
                      src={comment.avatar} 
                      className="w-10 h-10 rounded-full flex-shrink-0" 
                      alt={comment.username} 
                    />
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-900 dark:text-white">{comment.username}</span>
                        <span className="text-xs text-slate-400">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-400">No comments yet. Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryView;


