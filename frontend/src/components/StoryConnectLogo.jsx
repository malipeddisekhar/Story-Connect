import React from 'react';

/**
 * Unique StoryConnect logo — open book with connecting nodes,
 * symbolising stories linking people together.
 */
const StoryConnectLogo = ({ size = 40, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Gradient definitions */}
    <defs>
      <linearGradient id="bookGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#a855f7" />
      </linearGradient>
      <linearGradient id="pageGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#e0e7ff" />
        <stop offset="100%" stopColor="#f3e8ff" />
      </linearGradient>
    </defs>

    {/* Book spine + cover */}
    <rect x="4" y="10" width="40" height="28" rx="4" fill="url(#bookGrad)" />

    {/* Left page */}
    <rect x="5" y="11" width="18" height="26" rx="2" fill="url(#pageGrad)" opacity="0.95" />

    {/* Right page */}
    <rect x="25" y="11" width="18" height="26" rx="2" fill="url(#pageGrad)" opacity="0.95" />

    {/* Spine line */}
    <rect x="23" y="11" width="2" height="26" fill="url(#bookGrad)" opacity="0.6" />

    {/* Left page lines */}
    <rect x="8"  y="16" width="12" height="1.5" rx="0.75" fill="#6366f1" opacity="0.45" />
    <rect x="8"  y="20" width="10" height="1.5" rx="0.75" fill="#6366f1" opacity="0.45" />
    <rect x="8"  y="24" width="12" height="1.5" rx="0.75" fill="#6366f1" opacity="0.45" />
    <rect x="8"  y="28" width="8"  height="1.5" rx="0.75" fill="#6366f1" opacity="0.45" />

    {/* Right page lines */}
    <rect x="27" y="16" width="12" height="1.5" rx="0.75" fill="#a855f7" opacity="0.45" />
    <rect x="27" y="20" width="10" height="1.5" rx="0.75" fill="#a855f7" opacity="0.45" />
    <rect x="27" y="24" width="12" height="1.5" rx="0.75" fill="#a855f7" opacity="0.45" />
    <rect x="27" y="28" width="8"  height="1.5" rx="0.75" fill="#a855f7" opacity="0.45" />

    {/* Connection nodes — 3 dots above the book symbolising people/stories linked */}
    {/* Left node */}
    <circle cx="12" cy="6" r="3" fill="#6366f1" />
    {/* Center node */}
    <circle cx="24" cy="4" r="3.5" fill="#a855f7" />
    {/* Right node */}
    <circle cx="36" cy="6" r="3" fill="#6366f1" />

    {/* Connecting lines between nodes */}
    <line x1="15" y1="6" x2="21" y2="5" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
    <line x1="27" y1="5" x2="33" y2="6" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />

    {/* Dots connect down to book spine */}
    <line x1="24" y1="7.5" x2="24" y2="11" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
  </svg>
);

export default StoryConnectLogo;
