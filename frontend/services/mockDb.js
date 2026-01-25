
import { User, UserRole, Post } from '../types';

const USERS_KEY = 'storyconnect_users_v2';
const POSTS_KEY = 'storyconnect_posts_v2';

const INITIAL_USERS = [
  {
    id: 'u1',
    username: 'admin_master',
    email: 'admin@storyconnect.com',
    role: UserRole.ADMIN,
    avatar: 'https://picsum.photos/seed/admin/200',
    bio: 'Platform Supervisor and Content Moderator.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'u2',
    username: 'jane_narrator',
    email: 'jane@storyconnect.com',
    role: UserRole.AUTHOR,
    avatar: 'https://picsum.photos/seed/jane/200',
    bio: 'Storyteller, traveler, and professional dreamer.',
    createdAt: new Date().toISOString()
  }
];

const INITIAL_POSTS = [
  {
    id: 'p1',
    title: 'The Future of Digital Narrative',
    excerpt: 'How AI and humans are collaborating to build new worlds.',
    content: 'Storytelling has always been the fundamental unit of human connection. In the digital age, we see a fusion of technical precision and raw emotional depth. This platform is designed to facilitate that intersection, allowing every voice to resonate clearly in the noise of the 21st century.',
    authorId: 'u2',
    authorName: 'Jane Narrator',
    category: 'Technology',
    coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80',
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    readTime: '4 min'
  },
  {
    id: 'p2',
    title: 'The Zen of Minimalist Design',
    excerpt: 'Finding peace and clarity through reduction and intent.',
    content: 'In design, perfection is achieved not when there is nothing more to add, but when there is nothing left to take away. This philosophy applies equally to life and the digital interfaces we build. Clarity of purpose is the ultimate luxury in an over-stimulated world.',
    authorId: 'u1',
    authorName: 'Admin Master',
    category: 'Philosophy',
    coverImage: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=800&q=80',
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    readTime: '3 min'
  },
  {
    id: 'p3',
    title: 'Building Communities Through Stories',
    excerpt: 'The power of shared narratives in creating meaningful connections.',
    content: 'Communities are built on shared stories. When we share our experiences, we create bridges between different worlds and perspectives. This is the foundation of human connection and the essence of what makes storytelling so powerful.',
    authorId: 'u2',
    authorName: 'Jane Narrator',
    category: 'Community',
    coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    readTime: '5 min'
  },
  {
    id: 'p4',
    title: 'The Art of Creative Writing',
    excerpt: 'Discovering your unique voice in the world of storytelling.',
    content: 'Every writer has a unique voice waiting to be discovered. The journey of creative writing is about finding that voice and learning to express it authentically. Through practice and persistence, anyone can become a compelling storyteller.',
    authorId: 'u1',
    authorName: 'Admin Master',
    category: 'Writing',
    coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80',
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    readTime: '6 min'
  },
  {
    id: 'p5',
    title: 'Digital Transformation in Publishing',
    excerpt: 'How technology is reshaping the way we share and consume content.',
    content: 'The publishing industry has undergone a massive transformation in the digital age. From e-books to blogs, the ways we create and consume written content have evolved dramatically. This shift has democratized publishing, giving voice to millions.',
    authorId: 'u2',
    authorName: 'Jane Narrator',
    category: 'Technology',
    coverImage: 'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=800&q=80',
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    readTime: '4 min'
  },
  {
    id: 'p6',
    title: 'Finding Inspiration in Everyday Life',
    excerpt: 'How to turn ordinary moments into extraordinary stories.',
    content: 'Inspiration is everywhere if we know where to look. The mundane moments of daily life can become the foundation for powerful stories. By developing awareness and curiosity, we can find endless material for our creative work.',
    authorId: 'u1',
    authorName: 'Admin Master',
    category: 'Inspiration',
    coverImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80',
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    readTime: '3 min'
  }
];

export const getDb = () => {
  let users = [...INITIAL_USERS];
  let posts = [...INITIAL_POSTS];
  
  try {
    const usersJson = localStorage.getItem(USERS_KEY);
    const postsJson = localStorage.getItem(POSTS_KEY);
    
    if (usersJson) {
      try {
        const parsedUsers = JSON.parse(usersJson);
        if (Array.isArray(parsedUsers) && parsedUsers.length > 0) {
          users = parsedUsers;
        }
      } catch (e) {
        console.warn('Failed to parse users from localStorage, using initial data');
      }
    }
    
    if (postsJson) {
      try {
        const parsedPosts = JSON.parse(postsJson);
        if (Array.isArray(parsedPosts) && parsedPosts.length > 0) {
          posts = parsedPosts;
        }
      } catch (e) {
        console.warn('Failed to parse posts from localStorage, using initial data');
      }
    }
  } catch (error) {
    console.error('Error reading from localStorage:', error);
  }
  
  // Ensure we always have data - if posts are empty, use INITIAL_POSTS
  if (posts.length === 0) {
    posts = [...INITIAL_POSTS];
  }
  
  if (users.length === 0) {
    users = [...INITIAL_USERS];
  }
  
  // Always persist current data
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  } catch (e) {
    console.warn('Failed to save to localStorage');
  }

  return { users, posts };
};

export const saveDb = (users, posts) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
};

// Function to reset database to initial state
export const resetDb = () => {
  localStorage.setItem(USERS_KEY, JSON.stringify(INITIAL_USERS));
  localStorage.setItem(POSTS_KEY, JSON.stringify(INITIAL_POSTS));
  return { users: INITIAL_USERS, posts: INITIAL_POSTS };
};

// Initialize database on module load - ensures data exists
const initDb = () => {
  try {
    const postsJson = localStorage.getItem(POSTS_KEY);
    const usersJson = localStorage.getItem(USERS_KEY);
    
    // Check if posts exist and are not empty
    let needsPostsInit = true;
    if (postsJson) {
      try {
        const posts = JSON.parse(postsJson);
        if (Array.isArray(posts) && posts.length > 0) {
          needsPostsInit = false;
        }
      } catch (e) {
        // JSON parse failed, need to reinit
      }
    }
    
    // Check if users exist and are not empty
    let needsUsersInit = true;
    if (usersJson) {
      try {
        const users = JSON.parse(usersJson);
        if (Array.isArray(users) && users.length > 0) {
          needsUsersInit = false;
        }
      } catch (e) {
        // JSON parse failed, need to reinit
      }
    }
    
    if (needsPostsInit) {
      console.log('Initializing posts with default data');
      localStorage.setItem(POSTS_KEY, JSON.stringify(INITIAL_POSTS));
    }
    
    if (needsUsersInit) {
      console.log('Initializing users with default data');
      localStorage.setItem(USERS_KEY, JSON.stringify(INITIAL_USERS));
    }
  } catch (error) {
    console.error('Error in initDb:', error);
    localStorage.setItem(USERS_KEY, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(POSTS_KEY, JSON.stringify(INITIAL_POSTS));
  }
};

// Force clear and reinitialize if data is corrupted
export const forceReinitialize = () => {
  localStorage.removeItem(POSTS_KEY);
  localStorage.removeItem(USERS_KEY);
  localStorage.setItem(POSTS_KEY, JSON.stringify(INITIAL_POSTS));
  localStorage.setItem(USERS_KEY, JSON.stringify(INITIAL_USERS));
  console.log('Database reinitialized with', INITIAL_POSTS.length, 'posts');
  return { users: INITIAL_USERS, posts: INITIAL_POSTS };
};

initDb();




