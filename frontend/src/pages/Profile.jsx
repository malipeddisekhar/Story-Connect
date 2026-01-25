
import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPostsByAuthor, deletePost } from '../services/postService';
import { updateProfile } from '../services/authService';
import { UserRole } from '../types';

const Profile = ({ user: initialUser, onUserUpdate }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(initialUser);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [editUsername, setEditUsername] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [previewAvatar, setPreviewAvatar] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchUserPosts = async () => {
      const data = await getPostsByAuthor(user.id);
      setPosts(data);
      setLoading(false);
    };

    fetchUserPosts();
  }, [user, navigate]);

  const handleDelete = async (postId) => {
    await deletePost(postId);
    setPosts(posts.filter(p => p.id !== postId));
    setShowDeleteConfirm(null);
  };

  const openUpdateModal = () => {
    if (user) {
      setEditUsername(user.username);
      setEditBio(user.bio || '');
      setEditAvatar(user.avatar || '');
      setPreviewAvatar(user.avatar || '');
      setShowUpdateModal(true);
      setUpdateSuccess(false);
      setUpdateError('');
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setIsUploadingAvatar(true);
      setUpdateError('');
      
      try {
        // Convert to base64 for preview and storage
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result;
          setPreviewAvatar(base64String);
          setEditAvatar(base64String);
          setIsUploadingAvatar(false);
        };
        reader.onerror = () => {
          setUpdateError('Failed to read image file. Please try again.');
          setIsUploadingAvatar(false);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Failed to process avatar:', error);
        setUpdateError('Failed to process image. Please try again.');
        setIsUploadingAvatar(false);
      }
    }
  };

  const handleUpdateProfile = async () => {
    if (user) {
      setIsUpdating(true);
      setUpdateError('');
      
      try {
        const updatedUser = await updateProfile(user.id, {
          username: editUsername,
          bio: editBio,
          avatar: editAvatar
        });
        
        setUser(updatedUser);
        if (onUserUpdate) {
          onUserUpdate(updatedUser);
        }
        setUpdateSuccess(true);
        
        setTimeout(() => {
          setShowUpdateModal(false);
          setUpdateSuccess(false);
        }, 1500);
      } catch (error) {
        setUpdateError(error.message || 'Failed to update profile');
      } finally {
        setIsUpdating(false);
      }
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* User Info Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-100 dark:border-slate-800 shadow-xl sticky top-24 transition-colors">
            <div className="text-center mb-8">
              <div className="relative inline-block">
                <img 
                  src={user.avatar} 
                  alt={user.username} 
                  className="w-32 h-32 rounded-full mx-auto border-4 border-indigo-50 dark:border-slate-800 mb-4 object-cover"
                />
                <button 
                  onClick={openUpdateModal}
                  className="absolute bottom-4 right-0 w-8 h-8 bg-indigo-600 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center hover:bg-indigo-700 transition-colors cursor-pointer"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="white" className="w-4 h-4">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                   </svg>
                </button>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{user.username}</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">{user.email}</p>
              <div className="flex justify-center gap-2">
                <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-widest ${
                  user.role === UserRole.ADMIN ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 
                  user.role === UserRole.AUTHOR ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 
                  'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}>
                  {user.role}
                </span>
              </div>
            </div>
            
            <div className="border-t border-gray-100 dark:border-slate-800 pt-6">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">About Me</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed italic">
                {user.bio || "No bio added yet. Tell the community about yourself."}
              </p>
            </div>

            <div className="mt-8 space-y-3">
               <button 
                 onClick={openUpdateModal}
                 className="w-full py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 dark:shadow-none"
               >
                 Update Profile
               </button>
               {user.role === UserRole.READER && (
                 <Link to="/dashboard" className="block w-full text-center py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl text-sm font-bold hover:from-indigo-600 hover:to-purple-600 transition-all">
                   📚 My Dashboard
                 </Link>
               )}
               {user.role === UserRole.ADMIN && (
                 <Link to="/admin" className="block w-full text-center py-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                   Admin Dashboard
                 </Link>
               )}
            </div>
          </div>
        </div>

        {/* User Content Area */}
        <div className="lg:col-span-2">
          {user.role === UserRole.READER ? (
            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-10 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Welcome, Reader!</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-6">
                Discover stories, follow authors, bookmark your favorites, and track your reading history.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <Link to="/dashboard" className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl p-4 text-center hover:shadow-lg transition-all">
                  <div className="text-2xl mb-1">📊</div>
                  <div className="font-bold">My Dashboard</div>
                  <div className="text-xs text-indigo-200">Feed, Bookmarks, History</div>
                </Link>
                <Link to="/explore" className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-4 text-center hover:shadow-lg transition-all">
                  <div className="text-2xl mb-1">🔍</div>
                  <div className="font-bold text-slate-900 dark:text-white">Explore</div>
                  <div className="text-xs text-slate-500">Find new stories</div>
                </Link>
                <Link to="/authors" className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-4 text-center hover:shadow-lg transition-all">
                  <div className="text-2xl mb-1">✍️</div>
                  <div className="font-bold text-slate-900 dark:text-white">Authors</div>
                  <div className="text-xs text-slate-500">Discover writers</div>
                </Link>
                <Link to="/" className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-4 text-center hover:shadow-lg transition-all">
                  <div className="text-2xl mb-1">🏠</div>
                  <div className="font-bold text-slate-900 dark:text-white">Home</div>
                  <div className="text-xs text-slate-500">Latest stories</div>
                </Link>
              </div>
              <p className="text-sm text-slate-400 dark:text-slate-500">
                Want to share your own stories? Reach out to an admin to become an author.
              </p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Published Work</h2>
                <Link 
                  to="/create" 
                  className="px-6 py-2 bg-indigo-600 text-white rounded-full text-sm font-bold shadow-lg shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all"
                >
                  + New Story
                </Link>
              </div>

              {loading ? (
                <div className="flex justify-center py-20">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-600"></div>
                </div>
              ) : posts.length > 0 ? (
                <div className="space-y-6">
                  {posts.map(post => (
                    <div key={post.id} className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row gap-6 hover:shadow-lg transition-shadow">
                      <div className="w-full md:w-48 h-32 flex-shrink-0 overflow-hidden rounded-xl">
                        <img src={post.coverImage} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{post.category}</span>
                          <div className="flex gap-4">
                            <Link to={`/edit/${post.id}`} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 transition-colors">Edit</Link>
                            <button onClick={() => setShowDeleteConfirm(post.id)} className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors">Delete</button>
                          </div>
                        </div>
                        <Link to={`/story/${post.id}`} className="block">
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 hover:text-indigo-600 transition-colors">{post.title}</h3>
                        </Link>
                        <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-4">{post.excerpt}</p>
                        <div className="text-xs text-slate-400 font-medium">
                          {new Date(post.createdAt).toLocaleDateString()} • {post.readTime} • {post.published ? 'Public' : 'Draft'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-700">
                  <p className="text-slate-400 dark:text-slate-500 mb-4 text-lg">Your library is currently empty.</p>
                  <Link to="/create" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Write your first piece &rarr;</Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Update Profile Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            {updateSuccess ? (
              <div className="text-center py-8">
                <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-green-600 dark:text-green-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Profile Updated!</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Your changes have been saved successfully.</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Update Profile</h3>
                  <button 
                    onClick={() => setShowUpdateModal(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-slate-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Avatar Upload */}
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <img 
                      src={previewAvatar || 'https://via.placeholder.com/128'} 
                      alt="Profile" 
                      className={`w-24 h-24 rounded-full object-cover border-4 border-indigo-100 dark:border-slate-700 ${isUploadingAvatar ? 'opacity-50' : ''}`}
                    />
                    {isUploadingAvatar && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingAvatar}
                      className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                      </svg>
                    </button>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    {isUploadingAvatar ? 'Uploading...' : 'Click to change avatar'}
                  </p>
                </div>

                {/* Username */}
                <div className="mb-4">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Username</label>
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Your username"
                  />
                </div>

                {/* Email (read-only) */}
                <div className="mb-4">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                  />
                  <p className="text-xs text-slate-400 mt-1">Email cannot be changed</p>
                </div>

                {/* Bio */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">About Me</label>
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                    placeholder="Tell the community about yourself..."
                  />
                </div>

                {/* Error Message */}
                {updateError && (
                  <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl">
                    <p className="text-sm text-red-600 dark:text-red-400">{updateError}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowUpdateModal(false)}
                    disabled={isUpdating}
                    className="flex-1 px-4 py-3 bg-gray-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateProfile}
                    disabled={isUpdating}
                    className="flex-1 px-4 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isUpdating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4">
            <div className="text-center">
              <div className="mx-auto w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 text-red-600 dark:text-red-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Delete Story?</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                This action cannot be undone. Are you sure you want to delete this story?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;


