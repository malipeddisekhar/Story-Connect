import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-4 transition-colors">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-6">
            Privacy Policy
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Last updated: January 25, 2026
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Introduction</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              At StoryConnect, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
            </p>

            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 mt-8">Information We Collect</h2>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Personal Information</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              When you register for an account, we collect:
            </p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 mb-6 space-y-2">
              <li>Username and display name</li>
              <li>Email address</li>
              <li>Profile information (bio, avatar)</li>
              <li>Password (encrypted and securely stored)</li>
            </ul>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Content Information</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              When you create and publish stories, we collect:
            </p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 mb-6 space-y-2">
              <li>Story titles, content, and excerpts</li>
              <li>Cover images and media files</li>
              <li>Categories and tags</li>
              <li>Comments and interactions</li>
            </ul>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Usage Information</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              We automatically collect information about your interactions with our platform, including reading history, bookmarks, likes, and follows.
            </p>

            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 mt-8">How We Use Your Information</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 mb-6 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Personalize your experience and content recommendations</li>
              <li>Communicate with you about updates and new features</li>
              <li>Protect against fraud and abuse</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 mt-8">Data Security</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              We implement industry-standard security measures to protect your personal information. All passwords are encrypted, and we use secure connections (HTTPS) for all data transmission. However, no method of transmission over the internet is 100% secure.
            </p>

            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 mt-8">Your Rights</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 mb-6 space-y-2">
              <li>Access and update your personal information</li>
              <li>Delete your account and associated data</li>
              <li>Export your content</li>
              <li>Opt-out of marketing communications</li>
              <li>Request correction of inaccurate data</li>
            </ul>

            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 mt-8">Cookies and Tracking</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              We use cookies and similar technologies to maintain your session, remember your preferences, and analyze site usage. You can control cookie settings through your browser.
            </p>

            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 mt-8">Third-Party Services</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              We do not sell your personal information to third parties. We may share data with service providers who assist in operating our platform, but they are bound by confidentiality agreements.
            </p>

            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 mt-8">Children's Privacy</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              StoryConnect is not intended for users under the age of 13. We do not knowingly collect personal information from children under 13.
            </p>

            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 mt-8">Changes to This Policy</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>

            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 mt-8">Contact Us</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              If you have questions about this Privacy Policy, please contact us at:
            </p>
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-800">
              <p className="text-slate-700 dark:text-slate-300 font-bold mb-2">Email:</p>
              <a href="mailto:malipeddisekhar63@gmail.com" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                malipeddisekhar63@gmail.com
              </a>
              <p className="text-slate-700 dark:text-slate-300 font-bold mt-4 mb-2">Or use our:</p>
              <Link to="/contact" className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold">
                Contact Form →
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link to="/" className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
