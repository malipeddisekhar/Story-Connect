// Support both MySQL (local) and PostgreSQL (production)
let pool;
const isProduction = !!process.env.DATABASE_URL;

if (isProduction) {
  // Production: Use PostgreSQL on Render
  const { Pool } = require('pg');
  const pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  
  console.log('📦 Using PostgreSQL (Production)');
  
  // Wrapper to make PostgreSQL work like MySQL2
  pool = {
    query: async function(sql, params) {
      // Convert ? placeholders to $1, $2, $3...
      let paramIndex = 0;
      const convertedSql = sql.replace(/\?/g, () => `$${++paramIndex}`);
      
      try {
        const result = await pgPool.query(convertedSql, params);
        // Return in MySQL format: [rows, fields]
        return [result.rows, result.fields];
      } catch (err) {
        console.error('Query error:', err.message);
        console.error('SQL:', convertedSql);
        console.error('Params:', params);
        throw err;
      }
    },
    getConnection: async function() {
      const client = await pgPool.connect();
      return {
        query: async function(sql, params) {
          let paramIndex = 0;
          const convertedSql = sql.replace(/\?/g, () => `$${++paramIndex}`);
          const result = await client.query(convertedSql, params);
          return [result.rows, result.fields];
        },
        release: () => client.release(),
        beginTransaction: () => client.query('BEGIN'),
        commit: () => client.query('COMMIT'),
        rollback: () => client.query('ROLLBACK')
      };
    }
  };
  
  // Test connection
  (async () => {
    try {
      const client = await pgPool.connect();
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
