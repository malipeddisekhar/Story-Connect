
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { login, register, setCurrentUser } from '../services/authService';
import { User, UserRole } from '../types';

interface AuthProps {
  type: 'login' | 'register';
  onAuthSuccess: (user: User, token: string) => void;
}

const Auth: React.FC<AuthProps> = ({ type, onAuthSuccess }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: UserRole.READER
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('registered') === 'true' && type === 'login') {
      setSuccessMessage('Account created successfully! Please log in.');
    } else {
      setSuccessMessage('');
    }
    setError('');
  }, [location, type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      if (type === 'login') {
        const res = await login(formData.email, formData.password);
        setCurrentUser(res.user); // Store user in localStorage
        onAuthSuccess(res.user, res.token);
        navigate('/');
      } else {
        await register(formData.username, formData.email, formData.role, formData.password);
        navigate('/login?registered=true');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      {/* Form Card - Fully responsive to Dark Mode */}
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.1)] dark:shadow-[0_40px_100px_rgba(0,0,0,0.5)] p-12 border border-slate-100 dark:border-slate-800 transition-all duration-300">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-[2rem] mb-6 shadow-xl shadow-indigo-100 dark:shadow-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="white" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight transition-colors">
            {type === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium transition-colors">
            {type === 'login' ? 'Sign in to access your dashboard' : 'Start sharing your narrative today'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl text-sm font-bold border border-red-100 dark:border-red-900 flex items-center gap-2">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl text-sm font-bold border border-emerald-100 dark:border-emerald-900 flex items-center gap-2">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
          {type === 'register' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-2">Username</label>
                <input 
                  required
                  type="text" 
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  autoComplete="off"
                  className="w-full px-6 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white caret-indigo-600 dark:caret-indigo-400 font-semibold border-2 border-slate-200 dark:border-slate-700 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  placeholder="lohith2"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-2">Joining as</label>
                <select 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value as UserRole})}
                  autoComplete="off"
                  className="w-full px-6 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold border-2 border-slate-200 dark:border-slate-700 focus:border-indigo-500 outline-none transition-all cursor-pointer"
                >
                  <option value={UserRole.READER}>Reader</option>
                  <option value={UserRole.AUTHOR}>Author</option>
                </select>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-2">Email Address</label>
            <input 
              required
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              autoComplete="new-email"
              className="w-full px-6 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white caret-indigo-600 dark:caret-indigo-400 font-semibold border-2 border-slate-200 dark:border-slate-700 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
              placeholder="name@company.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-2">Password</label>
            <input 
              required
              type="password" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              autoComplete="new-password"
              className="w-full px-6 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white caret-indigo-600 dark:caret-indigo-400 font-semibold border-2 border-slate-200 dark:border-slate-700 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
              placeholder="••••••••"
            />
          </div>

          <button 
            disabled={loading}
            type="submit"
            className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 hover:-translate-y-1 transition-all disabled:opacity-50"
          >
            {loading ? 'Processing...' : type === 'login' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-10 text-center border-t border-slate-50 dark:border-slate-800 pt-8 transition-colors">
          <p className="text-slate-400 dark:text-slate-500 font-bold">
            {type === 'login' ? "New here?" : "Already have an account?"}
            <Link 
              to={type === 'login' ? '/register' : '/login'} 
              className="ml-2 font-black text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 transition-colors"
            >
              {type === 'login' ? 'Sign Up' : 'Sign In'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
