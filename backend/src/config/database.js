// Support both MySQL (local) and PostgreSQL (production)
let pool;
const isProduction = !!process.env.DATABASE_URL;

if (isProduction) {
  // Production: Use PostgreSQL on Render
  const { Pool } = require('pg');
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  
  console.log('📦 Using PostgreSQL (Production)');
  
  // Wrapper to convert MySQL-style queries to PostgreSQL
  const originalQuery = pool.query.bind(pool);
  pool.query = function(sql, params) {
    // Convert ? placeholders to $1, $2, $3...
    let paramIndex = 0;
    const convertedSql = sql.replace(/\?/g, () => `$${++paramIndex}`);
    return originalQuery(convertedSql, params);
  };
  
  // Test connection
  (async () => {
    try {
      const client = await pool.connect();
      console.log('✅ PostgreSQL Database connected successfully');
      client.release();
    } catch (err) {
      console.error('❌ Database connection error:', err.message);
    }
  })();
} else {
  // Local: Use MySQL
  const mysql = require('mysql2/promise');
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'storyconnect',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
  
  console.log('📦 Using MySQL (Local)');
  
  // Test connection
  (async () => {
    try {
      const connection = await pool.getConnection();
      console.log('✅ MySQL Database connected successfully');
      connection.release();
    } catch (err) {
      console.error('❌ Database connection error:', err.message);
    }
  })();
}

module.exports = pool;
