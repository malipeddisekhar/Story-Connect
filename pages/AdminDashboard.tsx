
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Post, UserRole } from '../types';
import { getDb, saveDb } from '../services/mockDb';

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'posts'>('users');

  useEffect(() => {
    const { users: u, posts: p } = getDb();
    setUsers(u);
    setPosts(p);
  }, []);

  const handleDeleteUser = (id: string) => {
    if (confirm('Permanently delete this user account? This cannot be undone.')) {
      const updated = users.filter(u => u.id !== id);
      setUsers(updated);
      saveDb(updated, posts);
    }
  };

  const handleDeletePost = (id: string) => {
    if (confirm('Permanently remove this story from the platform?')) {
      const updated = posts.filter(p => p.id !== id);
      setPosts(updated);
      saveDb(users, updated);
    }
  };

  const setRole = (id: string, newRole: UserRole) => {
    const updated = users.map(u => {
      if (u.id === id) return { ...u, role: newRole };
      return u;
    });
    setUsers(updated);
    saveDb(updated, posts);
  };

  const togglePostVisibility = (id: string) => {
    const updated = posts.map(p => {
      if (p.id === id) return { ...p, published: !p.published };
      return p;
    });
    setPosts(updated);
    saveDb(users, updated);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white transition-colors font-serif">Platform Control</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Manage users, roles, and narrative quality.</p>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-[1.5rem] transition-colors border border-slate-200 dark:border-slate-800">
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-8 py-3 rounded-[1.2rem] text-sm font-black transition-all ${activeTab === 'users' ? 'bg-white dark:bg-slate-800 shadow-xl text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
          >
            Users & Roles
          </button>
          <button 
            onClick={() => setActiveTab('posts')}
            className={`px-8 py-3 rounded-[1.2rem] text-sm font-black transition-all ${activeTab === 'posts' ? 'bg-white dark:bg-slate-800 shadow-xl text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
          >
            Story Moderation
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] border border-slate-100 dark:border-slate-900 shadow-2xl overflow-hidden transition-colors">
        {activeTab === 'users' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-900 transition-colors text-slate-400">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest">Community Member</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest">Email Address</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest">Status</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-900">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                        <img src={user.avatar} className="w-12 h-12 rounded-[1rem] object-cover border-2 border-slate-100 dark:border-slate-800" />
                        <div>
                          <p className="font-black text-slate-900 dark:text-slate-100">{user.username}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Joined {new Date(user.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-slate-500 dark:text-slate-400 text-sm font-bold">{user.email}</td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        user.role === UserRole.ADMIN ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900' : 
                        user.role === UserRole.AUTHOR ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900' : 
                        'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                        {user.role === UserRole.READER && (
                          <button onClick={() => setRole(user.id, UserRole.AUTHOR)} className="px-5 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">Promote to Author</button>
                        )}
                        {user.role === UserRole.AUTHOR && (
                          <button onClick={() => setRole(user.id, UserRole.READER)} className="px-5 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-black uppercase rounded-xl hover:bg-slate-300 transition-all">Demote to Reader</button>
                        )}
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all border border-transparent hover:border-red-100"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
             <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-900 transition-colors text-slate-400">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest">Story Title</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest">Author</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest">Visibility</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-900">
                {posts.map(post => (
                  <tr key={post.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <img src={post.coverImage} className="w-10 h-10 rounded-lg object-cover" />
                        <Link to={`/story/${post.id}`} className="font-black text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 line-clamp-1">{post.title}</Link>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-slate-500 dark:text-slate-400 text-sm font-bold">{post.authorName}</td>
                    <td className="px-8 py-6">
                      <button 
                        onClick={() => togglePostVisibility(post.id)}
                        className={`text-[10px] px-4 py-1.5 rounded-full font-black uppercase tracking-widest transition-all ${
                          post.published ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900' : 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900'
                        }`}
                      >
                        {post.published ? 'Public' : 'Hidden'}
                      </button>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-5 opacity-0 group-hover:opacity-100 transition-all">
                        <Link to={`/edit/${post.id}`} className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 hover:underline">Edit</Link>
                        <button 
                          onClick={() => handleDeletePost(post.id)}
                          className="text-[10px] font-black uppercase text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
