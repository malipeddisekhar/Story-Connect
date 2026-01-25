import os
import re

def clean_typescript(content):
    # Remove interfaces and types
    content = re.sub(r'interface\s+\w+\s*\{[^\}]*\}', '', content, flags=re.MULTILINE)
    content = re.sub(r'export\s+interface\s+\w+\s*\{[^\}]*\}', '', content, flags=re.MULTILINE)
    content = re.sub(r'type\s+\w+\s*=\s*[^;]+;', '', content)
    
    # Remove type annotations from function parameters
    content = re.sub(r'\(([^:)]+):\s*\w+(<[^>]+>)?\)', r'(\1)', content)
    content = re.sub(r'\(([^:)]+):\s*React\.\w+(<[^>]+>)?\)', r'(\1)', content)
    content = re.sub(r'\(([^:)]+):\s*\{[^\}]+\}\)', r'(\1)', content)
    
    # Remove return type annotations
    content = re.sub(r'\):\s*Promise<[^>]+>\s*=>', ') =>', content)
    content = re.sub(r'\):\s*\w+\s*=>', ') =>', content)
    content = re.sub(r'\):\s*\w+\s*\|\s*\w+\s*=>', ') =>', content)
    
    # Remove generic types from hooks
    content = re.sub(r'(useState|useParams|useRef|useCallback|useMemo)<[^>]+>', r'\1', content)
    
    # Remove 'as' type assertions
    content = re.sub(r'\s+as\s+\w+', '', content)
    
    # Remove variable type annotations
    content = re.sub(r'const\s+(\w+):\s*\w+(<[^>]+>)?(\[\])?\s*=', r'const \1 =', content)
    content = re.sub(r'let\s+(\w+):\s*\w+(<[^>]+>)?(\[\])?\s*=', r'let \1 =', content)
    
    # Remove : React.FC
    content = re.sub(r':\s*React\.FC(<[^>]+>)?', '', content)
    
    # Remove React type imports
    content = re.sub(r"import\s+type\s+\{[^\}]+\}\s+from\s+['\"]react['\"];?\s*\n", '', content)
    
    # Fix optional chaining
    content = re.sub(r'\?\.\[', ' && arr[', content)
    
    # Remove optional parameter syntax
    content = re.sub(r'(\w+)\?:', r'\1,', content)
    
    return content

# Process all files
for root, dirs, files in os.walk('.'):
    if 'node_modules' in root:
        continue
    for file in files:
        if file.endswith(('.jsx', '.js')):
            filepath = os.path.join(root, file)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                cleaned = clean_typescript(content)
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(cleaned)
                print(f'Cleaned: {filepath}')
            except Exception as e:
                print(f'Error processing {filepath}: {e}')

print('Done!')
