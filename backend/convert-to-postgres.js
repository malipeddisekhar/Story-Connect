const fs = require('fs');
const path = require('path');

// Read the current index.js file
const filePath = path.join(__dirname, 'index.js');
let content = fs.readFileSync(filePath, 'utf8');

// Conversion function to replace ? placeholders with $1, $2, etc.
function convertPlaceholders(line) {
  let paramCount = 0;
  return line.replace(/\?/g, () => {
    paramCount++;
    return `$${paramCount}`;
  });
}

// Split file into lines
const lines = content.split('\n');
const converted = [];

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  
  // Convert query placeholders
  if (line.includes('await pool.query') || (line.trim().startsWith("'") && line.includes('?'))) {
    line = convertPlaceholders(line);
  }
  
  // Convert array destructuring for query results
  if (line.includes('const [') && line.includes('] = await pool.query')) {
    line = line.replace(/const \[(\w+)\] = await pool\.query/g, 'const result = await pool.query');
    converted.push(line);
    const varName = line.match(/const result.*?(\w+) = result/)?.[1] || 'rows';
    // Add the next line to extract rows
    const indent = line.match(/^\s*/)[0];
    converted.push(`${indent}const ${line.match(/\[(\w+)\]/)?.[1] || 'rows'} = result.rows;`);
    continue;
  }
  
  // Convert NOW() to CURRENT_TIMESTAMP
  if (line.includes('NOW()')) {
    line = line.replace(/NOW\(\)/g, 'CURRENT_TIMESTAMP');
  }
  
  // Convert LIKE queries (keep as is, PostgreSQL supports LIKE)
  
  // Handle insertId for PostgreSQL
  if (line.includes('result.insertId')) {
    line = line.replace(/result\.insertId/g, 'result.rows[0].id');
  }
  
  converted.push(line);
}

// Write the converted file
fs.writeFileSync(filePath, converted.join('\n'), 'utf8');
console.log('Conversion complete!');
console.log('File converted to PostgreSQL syntax');
