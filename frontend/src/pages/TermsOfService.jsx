import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-4 transition-colors">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-6">
            Terms of Service
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Last updated: January 25, 2026
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Agreement to Terms</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              By accessing or using StoryConnect, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this platform.
            </p>

            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 mt-8">User Accounts</h2>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Account Creation</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              To use certain features of StoryConnect, you must create an account. You agree to:
            </p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 mb-6 space-y-2">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your password</li>
              <li>Notify us immediately of any unauthorized use</li>
              <li>Be responsible for all activities under your account</li>
            </ul>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">User Roles</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              StoryConnect has three user roles: Reader, Author, and Admin. Readers can explore and interact with content. Authors can publish stories. Admins moderate content and manage user roles.
            </p>

            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 mt-8">Content Guidelines</h2>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">User-Generated Content</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              When you publish content on StoryConnect, you agree that your content:
            </p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 mb-6 space-y-2">
              <li>Is original or properly attributed</li>
              <li>Does not violate any intellectual property rights</li>
              <li>Does not contain hate speech, harassment, or illegal content</li>
              <li>Does not contain spam or misleading information</li>
              <li>Complies with all applicable laws and regulations</li>
            </ul>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Content Moderation</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              We reserve the right to review, modify, or remove any content that violates these terms. Our admin team actively moderates published content to maintain quality and safety standards.
            </p>

            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 mt-8">Intellectual Property</h2>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Your Content</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              You retain all rights to the content you publish on StoryConnect. By publishing, you grant us a license to display, distribute, and promote your content on our platform.
            </p>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Our Platform</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              The StoryConnect platform, including its design, features, and technology, is protected by copyright and other intellectual property laws. You may not copy, modify, or distribute our platform without permission.
            </p>

            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 mt-8">Prohibited Activities</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              You agree not to:
            </p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 mb-6 space-y-2">
              <li>Use the platform for any illegal purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the platform's operation</li>
              <li>Impersonate others or provide false information</li>
              <li>Scrape or harvest user data without permission</li>
              <li>Upload malicious code or viruses</li>
            </ul>

            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 mt-8">Termination</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              We reserve the right to suspend or terminate your account at any time for violations of these terms. You may also delete your account at any time through your profile settings.
            </p>

            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 mt-8">Disclaimer of Warranties</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              StoryConnect is provided "as is" without any warranties, express or implied. We do not guarantee that the platform will be uninterrupted, secure, or error-free. Use at your own risk.
            </p>

            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 mt-8">Limitation of Liability</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              To the maximum extent permitted by law, StoryConnect shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the platform.
            </p>

            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 mt-8">Changes to Terms</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              We may update these Terms of Service at any time. Continued use of the platform after changes constitutes acceptance of the new terms. We will notify users of significant changes.
            </p>

            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 mt-8">Governing Law</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              These terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law provisions.
            </p>

            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 mt-8">Contact Information</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              If you have questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-800">
              <p className="text-slate-700 dark:text-slate-300 font-bold mb-2">Email:</p>
              <a href="mailto:malipeddisekhar63@gmail.com" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                malipeddisekhar63@gmail.com
              </a>
              <p className="text-slate-700 dark:text-slate-300 font-bold mt-4 mb-2">Or visit our:</p>
              <Link to="/contact" className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold">
                Contact Page →
              </Link>
            </div>

            <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
              <p className="text-slate-700 dark:text-slate-300 font-bold mb-2">
                By using StoryConnect, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
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

export default TermsOfService;
