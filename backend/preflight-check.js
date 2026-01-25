#!/usr/bin/env node

/**
 * Pre-flight check script for StoryConnect
 * Validates environment, dependencies, and database before starting
 */

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const checks = {
  passed: [],
  failed: [],
  warnings: []
};

function log(symbol, message) {
  console.log(`${symbol} ${message}`);
}

async function checkEnvironment() {
  log('🔍', 'Checking environment variables...');
  
  require('dotenv').config();
  
  const required = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'JWT_SECRET'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    checks.failed.push(`Missing environment variables: ${missing.join(', ')}`);
    log('❌', `Missing: ${missing.join(', ')}`);
  } else {
    checks.passed.push('Environment variables configured');
    log('✅', 'All required environment variables present');
  }
  
  if (!process.env.GEMINI_API_KEY) {
    checks.warnings.push('GEMINI_API_KEY not set - AI features will be disabled');
    log('⚠️', 'GEMINI_API_KEY not set - AI features disabled');
  }
}

async function checkDatabase() {
  log('🔍', 'Checking database connection...');
  
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'storyconnect',
      port: process.env.DB_PORT || 3306
    });
    
    const connection = await pool.getConnection();
    checks.passed.push('Database connection successful');
    log('✅', 'Database connection successful');
    
    // Check tables
    const [tables] = await connection.query(
      "SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = ?",
      [process.env.DB_NAME || 'storyconnect']
    );
    
    const tableCount = tables[0].count;
    if (tableCount < 8) {
      checks.failed.push(`Only ${tableCount} tables found (expected 8+)`);
      log('❌', `Incomplete database: ${tableCount} tables (expected 8+)`);
      log('💡', 'Run: mysql -u root -p storyconnect < setup-database.sql');
    } else {
      checks.passed.push(`Database has ${tableCount} tables`);
      log('✅', `Database schema complete (${tableCount} tables)`);
    }
    
    connection.release();
    await pool.end();
    
  } catch (error) {
    checks.failed.push(`Database error: ${error.message}`);
    log('❌', `Database connection failed: ${error.message}`);
  }
}

async function checkUploadsDirectory() {
  log('🔍', 'Checking uploads directory...');
  
  const uploadsDir = path.join(__dirname, 'uploads', 'avatars');
  
  if (!fs.existsSync(uploadsDir)) {
    try {
      fs.mkdirSync(uploadsDir, { recursive: true });
      checks.passed.push('Created uploads/avatars directory');
      log('✅', 'Created uploads/avatars directory');
    } catch (error) {
      checks.failed.push(`Failed to create uploads directory: ${error.message}`);
      log('❌', `Failed to create uploads directory`);
    }
  } else {
    checks.passed.push('Uploads directory exists');
    log('✅', 'Uploads directory exists');
  }
}

async function checkDependencies() {
  log('🔍', 'Checking dependencies...');
  
  const nodeModules = path.join(__dirname, 'node_modules');
  
  if (!fs.existsSync(nodeModules)) {
    checks.failed.push('node_modules not found');
    log('❌', 'Dependencies not installed');
    log('💡', 'Run: npm install');
  } else {
    checks.passed.push('Dependencies installed');
    log('✅', 'Dependencies installed');
  }
}

async function checkPort() {
  log('🔍', 'Checking port availability...');
  
  const port = process.env.PORT || 5000;
  const net = require('net');
  
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        checks.warnings.push(`Port ${port} is in use`);
        log('⚠️', `Port ${port} already in use`);
      }
      resolve();
    });
    
    server.once('listening', () => {
      server.close();
      checks.passed.push(`Port ${port} is available`);
      log('✅', `Port ${port} available`);
      resolve();
    });
    
    server.listen(port);
  });
}

async function main() {
  console.log('\n╔═══════════════════════════════════════════════════╗');
  console.log('║     StoryConnect Pre-flight Check                 ║');
  console.log('╚═══════════════════════════════════════════════════╝\n');
  
  await checkDependencies();
  await checkEnvironment();
  await checkDatabase();
  await checkUploadsDirectory();
  await checkPort();
  
  console.log('\n╔═══════════════════════════════════════════════════╗');
  console.log('║     Summary                                       ║');
  console.log('╚═══════════════════════════════════════════════════╝\n');
  
  log('✅', `${checks.passed.length} checks passed`);
  if (checks.warnings.length > 0) {
    log('⚠️', `${checks.warnings.length} warnings`);
    checks.warnings.forEach(w => log('   ', w));
  }
  if (checks.failed.length > 0) {
    log('❌', `${checks.failed.length} checks failed`);
    checks.failed.forEach(f => log('   ', f));
    console.log('\n❌ Pre-flight check FAILED. Please fix issues above.\n');
    process.exit(1);
  }
  
  console.log('\n✅ All checks passed! Server is ready to start.\n');
  console.log('Run: npm start\n');
}

main().catch(error => {
  console.error('Pre-flight check error:', error);
  process.exit(1);
});
