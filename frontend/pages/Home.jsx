
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';
import { getAllPosts } from '../services/postService';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await getAllPosts();
      setPosts(data);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="mb-24 text-center">
        <div className="inline-block px-4 py-1.5 mb-6 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-xs font-black rounded-full uppercase tracking-widest border border-indigo-100 dark:border-indigo-800">
          StoryConnect Narrative Engine
        </div>
        <h1 className="text-5xl md:text-8xl font-serif font-bold text-slate-900 dark:text-white mb-8 leading-tight transition-colors duration-500">
          Write. Connect. <br /> <span className="text-indigo-600 dark:text-indigo-400 italic">Inspire.</span>
        </h1>
        <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-12 transition-colors">
          Experience a full-stack storytelling ecosystem where Readers become Authors, and quality is protected by a professional moderation network.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/register" className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-2xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 hover:-translate-y-1 transition-all">
            Get Started
          </Link>
          <a href="#about" className="px-10 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-2xl font-black hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
            Learn More
          </a>
        </div>
      </section>

      {/* Related Matter: Vision */}
      <section id="about" className="mb-32 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-10 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl transition-all">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="white" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9s2.015-9 4.5-9m0 0a9.015 9.015 0 0 1 8.716 6.747M12 3a9.015 9.015 0 0 0-8.716 6.747m17.432 0c.229.846.352 1.74.352 2.662 0 4.97-4.03 9-9 9s-9-4.03-9-9c0-.921.123-1.816.352-2.662m17.432 0c-1.317-4.73-5.633-8.156-10.716-8.156-5.083 0-9.399 3.426-10.716 8.156" />
            </svg>
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 transition-colors">Our Mission</h3>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium transition-colors">
            StoryConnect is built to democratize professional blogging. We provide the infrastructure; you provide the inspiration.
          </p>
        </div>
        <div className="p-10 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl transition-all">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="white" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
            </svg>
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 transition-colors">Integrity First</h3>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium transition-colors">
            Every story is reviewed. Every author is verified. We maintain a high-quality ecosystem through active admin moderation.
          </p>
        </div>
        <div className="p-10 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl transition-all">
          <div className="w-12 h-12 bg-amber-600 rounded-2xl flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="white" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0a5.995 5.995 0 0 0-4.058-2.932m0 0a3 3 0 1 0-4.681 2.72M9 18.72a9.094 9.094 0 0 1-3.741-.479 3 3 0 0 1 4.682-2.72m-.94 3.198-.001.031c0 .225.012.447.037.666A11.944 11.944 0 0 0 12 21c2.17 0 4.207-.576 5.963-1.584A6.062 6.062 0 0 0 18 18.719m-12 0a5.971 5.971 0 0 1 .941-3.197m0 0a5.995 5.995 0 0 1 4.058-2.932m0 0a3 3 0 1 1 4.681 2.72M13.314 10.385a3 3 0 1 1-2.628 0" />
            </svg>
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 transition-colors">Community Led</h3>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium transition-colors">
            Engage with diverse perspectives. Follow your favorite authors. Become a voice that matters in our growing network.
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="mb-32">
        <h2 className="text-4xl font-black text-slate-900 dark:text-white text-center mb-16 font-serif transition-colors">The Story Path</h2>
        <div className="flex flex-col md:flex-row gap-12 items-start">
          <div className="flex-1 text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-black text-indigo-600">1</div>
            <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2 transition-colors">Join</h4>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed transition-colors">Explore thousands of stories from diverse creators around the globe.</p>
          </div>
          <div className="hidden md:block w-px h-32 bg-slate-100 dark:bg-slate-800 mt-8"></div>
          <div className="flex-1 text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-black text-indigo-600">2</div>
            <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2 transition-colors">Become Author</h4>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed transition-colors">Get promoted by our admin team to start publishing your own narratives.</p>
          </div>
          <div className="hidden md:block w-px h-32 bg-slate-100 dark:bg-slate-800 mt-8"></div>
          <div className="flex-1 text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-black text-indigo-600">3</div>
            <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2 transition-colors">Inspire Others</h4>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed transition-colors">Reach a global audience and build a community around your words.</p>
          </div>
        </div>
      </section>

      {/* Latest Stories Section */}
      <div className="flex justify-between items-end mb-12">
        <h2 className="text-4xl font-black text-slate-900 dark:text-white font-serif transition-colors">Featured Narratives</h2>
        <Link to="/register" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Explore More &rarr;</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-24">
        {posts.map((post) => (
          <article key={post.id} className="group flex flex-col h-full">
            <Link to={`/story/${post.id}`} className="flex flex-col h-full">
              <div className="relative overflow-hidden rounded-[2.5rem] aspect-[16/10] mb-8 shadow-xl dark:shadow-none transition-all duration-300">
                <img 
                  src={post.coverImage} 
                  alt={post.title} 
                  className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-6 left-6">
                  <span className="px-4 py-1.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm text-indigo-600 dark:text-indigo-400 text-xs font-black rounded-full shadow-lg transition-colors">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="flex flex-col flex-grow">
                <div className="flex items-center gap-3 mb-4 text-xs text-slate-400 font-black uppercase tracking-widest transition-colors">
                  <span>{post.authorName}</span>
                  <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></span>
                  <span>{post.readTime} Read</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {post.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-6 font-medium transition-colors">
                  {post.excerpt}
                </p>
              </div>
            </Link>
          </article>
        ))}
      </div>

      <section className="bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] p-12 md:p-20 text-center border border-slate-100 dark:border-slate-800 transition-colors duration-500">
        <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-6 transition-colors">Start Your Journey Today</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed font-bold text-lg transition-colors">
          Join thousands of creators sharing their perspective with the world. Registration is free and takes 60 seconds.
        </p>
        <Link to="/register" className="inline-flex px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-2xl shadow-indigo-200 dark:shadow-none hover:-translate-y-1 transition-all">
          Create Free Account
        </Link>
      </section>
    </div>
  );
};

export default Home;
