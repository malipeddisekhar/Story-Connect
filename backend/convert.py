import re
import sys

def convert_query_to_postgres(content):
    """Convert MySQL queries to PostgreSQL format"""
    
    # Step 1: Replace ? placeholders with $1, $2, $3, etc. in query strings
    def replace_placeholders(match):
        query_line = match.group(0)
        parts = query_line.split("'")
        
        for i in range(len(parts)):
            if i % 2 == 1:  # Inside quotes
                param_count = 0
                def increment_param(m):
                    nonlocal param_count
                    param_count += 1
                    return f'${param_count}'
                parts[i] = re.sub(r'\?', increment_param, parts[i])
        
        return "'".join(parts)
    
    # Replace ? in SQL queries
    content = re.sub(r"'[^']*\?[^']*'", replace_placeholders, content)
    
    # Step 2: Convert const [result] = await pool.query to proper PostgreSQL style
    content = re.sub(
        r'const \[(\w+)\] = await pool\.query\(([^;]+)\);',
        r'const \1 = (await pool.query(\2)).rows;',
        content
    )
    
    # Step 3: Convert NOW() to CURRENT_TIMESTAMP
    content = re.sub(r'NOW\(\)', 'CURRENT_TIMESTAMP', content)
    
    # Step 4: Handle INSERT...RETURNING for insertId cases
    content = re.sub(
        r"'INSERT INTO comments \(([^)]+)\) VALUES \(([^)]+)\)'",
        r"'INSERT INTO comments (\1) VALUES (\2) RETURNING id'",
        content
    )
    
    # Step 5: Fix result.insertId references
    content = re.sub(r'result\.insertId', 'result[0].id', content)
    
    return content

# Read the file
with open('index.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Convert
converted = convert_query_to_postgres(content)

# Write back
with open('index.js', 'w', encoding='utf-8') as f:
    f.write(converted)

print("Conversion completed successfully!")
