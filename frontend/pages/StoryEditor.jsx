
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { User, UserRole } from '../types';
import { createPost, updatePost, getPostById } from '../services/postService';
import { polishStoryContent, generateExcerpt } from '../services/geminiService';

const StoryEditor = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'Lifestyle',
    content: '',
    coverImage: 'https://picsum.photos/seed/travel/800/400',
    published: true
  });

  useEffect(() => {
    if (!user || (user.role === UserRole.READER && !id)) {
      navigate('/');
      return;
    }

    if (id) {
      const fetchPost = async () => {
        const post = await getPostById(id);
        if (post) {
          if (user.role !== UserRole.ADMIN && post.authorId !== user.id) {
            navigate('/');
            return;
          }
          setFormData({
            title: post.title,
            category: post.category,
            content: post.content,
            coverImage: post.coverImage,
            published: post.published
          });
        }
      };
      fetchPost();
    }
  }, [id, user, navigate]);

  const handleAiPolish = async () => {
    if (!formData.content) return;
    setAiLoading(true);
    try {
      const improved = await polishStoryContent(formData.content);
      setFormData({ ...formData, content: improved });
    } finally {
      setAiLoading(false);
    }
  };

  const handleSave = async (isPublished) => {
    if (!user) return;
    setLoading(true);

    try {
      const excerpt = await generateExcerpt(formData.content);
      
      const postData = {
        ...formData,
        excerpt,
        published: isPublished,
        authorId: user.id,
        authorName: user.username
      };

      if (id) {
        await updatePost(id, postData);
      } else {
        await createPost(postData);
      }
      
      navigate('/profile');
    } catch (error) {
      console.error(error);
      alert('Failed to save story.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white transition-colors">
            {id ? 'Refine Story' : 'New Story'}
          </h1>
        </div>
        <button 
          type="button"
          onClick={handleAiPolish}
          disabled={aiLoading}
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl text-sm font-black hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-all border border-indigo-100 dark:border-indigo-800 disabled:opacity-50"
        >
          {aiLoading ? '✨ Editing...' : '✨ AI Polish'}
        </button>
      </div>

      <div className="space-y-8">
        <div className="space-y-6 bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 transition-colors">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Title</label>
            <input 
              required
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-white focus:border-indigo-500 outline-none text-2xl font-black transition-all placeholder:text-slate-300"
              placeholder="Enter title..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-white focus:border-indigo-500 outline-none transition-all cursor-pointer font-bold"
              >
                <option>Lifestyle</option>
                <option>Technology</option>
                <option>Culture</option>
                <option>Philosophy</option>
                <option>Design</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Cover Image URL</label>
              <input 
                type="url" 
                value={formData.coverImage}
                onChange={(e) => setFormData({...formData, coverImage: e.target.value})}
                className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-white focus:border-indigo-500 outline-none transition-all font-bold"
                placeholder="https://images.unsplash.com/..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Content</label>
            <textarea 
              required
              rows={12}
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-white focus:border-indigo-500 outline-none min-h-[400px] leading-relaxed transition-all font-serif text-lg"
              placeholder="Start writing..."
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-4 pb-20">
          <button 
            type="button"
            onClick={() => navigate('/')}
            className="px-8 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-black hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            Cancel
          </button>
          <button 
            disabled={loading}
            type="button"
            onClick={() => handleSave(false)}
            className="px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-black hover:bg-slate-200 dark:hover:bg-slate-700 transition-all disabled:opacity-50"
          >
            Save Draft
          </button>
          <button 
            disabled={loading}
            type="button"
            onClick={() => handleSave(true)}
            className="px-12 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50"
          >
            {loading ? 'Publishing...' : 'Go Live Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryEditor;
